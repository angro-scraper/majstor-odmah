import { BusinessesService } from "./businesses.service";

describe("BusinessesService", () => {
  const prisma = {
    business: { findFirst: jest.fn() },
    businessFollower: { upsert: jest.fn(), deleteMany: jest.fn() },
  };
  const service = new BusinessesService(prisma as never);

  beforeEach(() => jest.clearAllMocks());

  it("follows a verified public business without creating duplicate follows", async () => {
    prisma.business.findFirst.mockResolvedValue({ id: "business-1" });
    prisma.businessFollower.upsert.mockResolvedValue({ userId: "user-1", businessId: "business-1" });

    await service.follow("business-1", "user-1");

    expect(prisma.businessFollower.upsert).toHaveBeenCalledWith({
      where: { userId_businessId: { userId: "user-1", businessId: "business-1" } },
      update: {},
      create: { userId: "user-1", businessId: "business-1" },
    });
  });
});
