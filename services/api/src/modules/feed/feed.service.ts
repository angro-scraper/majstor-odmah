import { Injectable } from "@nestjs/common";
import { OfferStatus, SaveFoodPackageStatus } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async personalized(userId: string) {
    const [interests, location] = await Promise.all([
      this.prisma.userInterest.findMany({ where: { userId }, include: { category: true }, orderBy: { score: "desc" }, take: 5 }),
      this.prisma.userLocation.findFirst({ where: { userId, isPrimary: true }, select: { cityId: true } }),
    ]);
    const categoryIds = interests.map((interest) => interest.categoryId);
    const cityId = location?.cityId;
    const [offers, packages, businesses] = await Promise.all([
      this.prisma.offer.findMany({ where: { deletedAt: null, status: OfferStatus.ACTIVE, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }], ...(categoryIds.length ? { categoryId: { in: categoryIds } } : {}), ...(cityId ? { business: { locations: { some: { cityId, deletedAt: null } } } } : {}) }, include: { business: { select: { id: true, name: true, slug: true } }, category: true }, orderBy: { createdAt: "desc" }, take: 8 }),
      this.prisma.saveFoodPackage.findMany({ where: { deletedAt: null, status: SaveFoodPackageStatus.ACTIVE, quantityAvailable: { gt: 0 }, pickupEndAt: { gt: new Date() }, ...(cityId ? { business: { locations: { some: { cityId, deletedAt: null } } } } : {}) }, include: { business: { select: { id: true, name: true, slug: true } } }, orderBy: { pickupEndAt: "asc" }, take: 6 }),
      this.prisma.business.findMany({ where: { deletedAt: null, status: "VERIFIED", ...(categoryIds.length ? { categoryId: { in: categoryIds } } : {}), ...(cityId ? { locations: { some: { cityId, deletedAt: null } } } : {}) }, include: { category: true, locations: { include: { city: true }, where: { deletedAt: null } }, _count: { select: { reviews: true } } }, orderBy: { createdAt: "desc" }, take: 6 }),
    ]);
    return { basedOn: { cityId, interests: interests.map((interest) => ({ id: interest.categoryId, name: interest.category.name, score: interest.score })) }, sections: [{ type: "SAVE_FOOD", title: "Save Food blizu tebe", items: packages }, { type: "DEALS", title: "Akcije za tebe", items: offers }, { type: "BUSINESSES", title: "Lokalni favoriti", items: businesses }] };
  }
}
