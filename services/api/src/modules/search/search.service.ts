import { Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class SearchBusinessesDto {
  @IsOptional() @IsString() @MaxLength(160) query?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @IsString() @MaxLength(100) city?: string;
  @IsOptional() @IsUUID() countryId?: string;
  @IsOptional() @IsString() @MaxLength(2) countryCode?: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async businesses(input: SearchBusinessesDto, userId?: string) {
    const query = input.query?.trim();
    const cityWhere = {
      ...(input.city ? { name: { equals: input.city.trim(), mode: "insensitive" as const } } : {}),
      ...(input.countryId ? { countryId: input.countryId } : {}),
      ...(input.countryCode ? { country: { code: input.countryCode.trim().toUpperCase(), isActive: true, deletedAt: null } } : {}),
    };
    const hasLocationFilter = Boolean(input.cityId || Object.keys(cityWhere).length);
    const where = {
      deletedAt: null,
      status: "VERIFIED" as const,
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(hasLocationFilter ? {
        locations: {
          some: {
            deletedAt: null,
            ...(input.cityId ? { cityId: input.cityId } : {}),
            ...(Object.keys(cityWhere).length ? { city: cityWhere } : {}),
          },
        },
      } : {}),
      ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" as const } }, { description: { contains: query, mode: "insensitive" as const } }, { services: { some: { name: { contains: query, mode: "insensitive" as const }, deletedAt: null } } }] } : {}),
    };
    const results = await this.prisma.business.findMany({
      where,
      include: { category: true, locations: { include: { city: { include: { country: true } } }, where: { deletedAt: null } }, images: { where: { deletedAt: null }, take: 1, orderBy: { orderIndex: "asc" } }, _count: { select: { reviews: true } } },
      orderBy: [{ verificationStatus: "desc" }, { name: "asc" }],
      take: 30,
    });
    await this.prisma.searchQuery.create({ data: { userId, query: query ?? "", location: input.cityId ?? input.city, resultsCount: results.length } });
    return results;
  }
}
