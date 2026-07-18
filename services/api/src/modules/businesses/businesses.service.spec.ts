import { BusinessesService } from "./businesses.service";

describe("BusinessesService", () => {
  const prisma = {
    business: { findFirst: jest.fn() },
    businessFollower: { findUnique: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
  };
  const rewards = { award: jest.fn() };
  const service = new BusinessesService(prisma as never, rewards as never);

  beforeEach(() => jest.clearAllMocks());

  it("follows a verified public business without creating duplicate follows", async () => {
    prisma.business.findFirst.mockResolvedValue({ id: "business-1" });
    prisma.businessFollower.findUnique.mockResolvedValue(null);
    prisma.businessFollower.create.mockResolvedValue({ userId: "user-1", businessId: "business-1" });
    rewards.award.mockResolvedValue({ awarded: true });

    await service.follow("business-1", "user-1");

    expect(prisma.businessFollower.create).toHaveBeenCalledWith({ data: { userId: "user-1", businessId: "business-1" } });
    expect(rewards.award).toHaveBeenCalled();
  });
});
