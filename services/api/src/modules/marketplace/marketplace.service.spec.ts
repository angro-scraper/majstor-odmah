import { JobType, MarketplaceItemStatus } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { MarketplaceService } from "./marketplace.service";

describe("MarketplaceService", () => {
  it("publishes a validated marketplace listing as active", async () => {
    const prisma = { marketplaceItem: { create: jest.fn().mockResolvedValue({ id: "listing", status: MarketplaceItemStatus.ACTIVE }) } } as unknown as PrismaService;
    const service = new MarketplaceService(prisma);
    const result = await service.createMarketplaceItem("seller", { title: "  Laptop  ", description: "  Ispravan laptop  ", price: 450, category: " Elektronika ", imageUrls: [] });
    expect(result.status).toBe(MarketplaceItemStatus.ACTIVE);
    expect(prisma.marketplaceItem.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ sellerId: "seller", title: "Laptop", category: "Elektronika" }) }));
  });

  it("rejects a job with an inverted salary range", async () => {
    const prisma = { business: { findFirst: jest.fn().mockResolvedValue({ id: "business" }) } } as unknown as PrismaService;
    const service = new MarketplaceService(prisma);
    await expect(service.createJob("owner", { businessId: "business", title: "Developer", description: "Opis otvorene pozicije", category: "IT", type: JobType.FULL_TIME, salaryMin: 3000, salaryMax: 2000 })).rejects.toThrow("INVALID_SALARY_RANGE");
  });
});
