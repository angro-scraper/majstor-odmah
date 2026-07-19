import { OperationsService } from "./operations.service";

describe("OperationsService launch scorecard", () => {
  const prisma = {
    city: { findFirst: jest.fn() },
    business: { count: jest.fn() },
    user: { count: jest.fn() },
    offer: { count: jest.fn() },
  };
  const service = new OperationsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.LAUNCH_PILOT_CITY;
    delete process.env.LAUNCH_TARGET_ACTIVE_BUSINESSES;
  });

  it("uses observed city supply and demand rather than reporting a launch prematurely", async () => {
    prisma.city.findFirst.mockResolvedValue({ id: "city-1", name: "Beograd", country: { code: "RS", name: "Serbia" } });
    prisma.business.count.mockResolvedValueOnce(420).mockResolvedValueOnce(300);
    prisma.user.count.mockResolvedValue(12_000);
    prisma.offer.count.mockResolvedValue(800);

    const result = await service.launchReadiness();

    expect(result.status).toBe("NOT_READY");
    expect(result.gates).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "active_businesses", current: 420, target: 500, met: false }),
      expect.objectContaining({ key: "verified_business_rate", current: 71, target: 60, met: true }),
    ]));
    expect(prisma.business.count).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ locations: { some: { cityId: "city-1", deletedAt: null } } }) }));
  });

  it("keeps launch package promises scoped to enabled and contracted capabilities", () => {
    const plan = service.launchPlan();

    expect(plan.pilotCity).toBe("Beograd");
    expect(plan.businessPackages).toHaveLength(3);
    expect(plan.safeguards).toContain("Ne prikazivati pipeline ili potencijalne ugovore kao prihod ili aktivna partnerstva.");
  });

  it("keeps the company roadmap directional and gated instead of treating targets as releases", () => {
    const roadmap = service.globalRoadmap();

    expect(roadmap.phases).toHaveLength(5);
    expect(roadmap.phases[0]).toMatchObject({ key: "FOUNDATION", directionalTargets: { users: 50_000, businesses: 1_000, offers: 100_000 } });
    expect(roadmap.disclaimer).toContain("planiranje");
  });
});
