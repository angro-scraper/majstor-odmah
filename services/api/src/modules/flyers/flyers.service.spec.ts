import { NotFoundException } from "@nestjs/common";
import { FlyersService } from "./flyers.service";

describe("FlyersService", () => {
  const prisma = {
    business: { findFirst: jest.fn() },
    digitalFlyer: { create: jest.fn(), findMany: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  const features = { isEnabled: jest.fn() };
  const service = new FlyersService(prisma as never, features as never);

  beforeEach(() => jest.clearAllMocks());

  it("keeps the module unavailable until its feature flag is enabled", async () => {
    features.isEnabled.mockReturnValue(false);
    await expect(service.list({})).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates a draft only for the owner of the business", async () => {
    features.isEnabled.mockReturnValue(true);
    prisma.business.findFirst.mockResolvedValue({ id: "business-1" });
    prisma.digitalFlyer.create.mockResolvedValue({ id: "flyer-1", businessId: "business-1", title: "Letnja ponuda" });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    const flyer = await service.create("owner-1", { businessId: "business-1", title: " Letnja ponuda " });

    expect(flyer.id).toBe("flyer-1");
    expect(prisma.digitalFlyer.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ title: "Letnja ponuda" }) }));
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it("stores ordered pages when a business creates a multipage flyer", async () => {
    features.isEnabled.mockReturnValue(true);
    prisma.business.findFirst.mockResolvedValue({ id: "business-1" });
    prisma.digitalFlyer.create.mockResolvedValue({ id: "flyer-2", businessId: "business-1", title: "Katalog", pages: [] });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-2" });

    await service.create("owner-1", {
      businessId: "business-1",
      title: "Katalog",
      pages: [{ imageUrl: "https://cdn.example.test/page-1.jpg", pageNumber: 1 }],
    });

    expect(prisma.digitalFlyer.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ pages: { create: [{ imageUrl: "https://cdn.example.test/page-1.jpg", pageNumber: 1 }] } }),
    }));
  });
});
