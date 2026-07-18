import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsUUID } from "class-validator";

export class FavoriteBusinessDto { @IsUUID() businessId!: string; }

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.favorite.findMany({ where: { userId, businessId: { not: null }, deletedAt: null }, include: { business: { include: { category: true, locations: { include: { city: true }, where: { deletedAt: null } } } } }, orderBy: { createdAt: "desc" } });
  }

  async add(userId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, status: "VERIFIED", deletedAt: null } });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    const existing = await this.prisma.favorite.findFirst({ where: { userId, businessId } });
    if (existing) return this.prisma.favorite.update({ where: { id: existing.id }, data: { deletedAt: null } });
    return this.prisma.favorite.create({ data: { userId, businessId } });
  }

  async remove(userId: string, businessId: string) {
    const favorite = await this.prisma.favorite.findFirst({ where: { userId, businessId, deletedAt: null } });
    if (!favorite) throw new NotFoundException("FAVORITE_NOT_FOUND");
    await this.prisma.favorite.update({ where: { id: favorite.id }, data: { deletedAt: new Date() } });
  }
}
