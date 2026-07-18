import { Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class SearchBusinessesDto {
  @IsOptional() @IsString() @MaxLength(160) query?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @IsString() @MaxLength(100) city?: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async businesses(input: SearchBusinessesDto, userId?: string) {
    const query = input.query?.trim();
    const where = {
      deletedAt: null,
      status: "VERIFIED" as const,
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(input.cityId ? { locations: { some: { cityId: input.cityId, deletedAt: null } } } : {}),
      ...(!input.cityId && input.city ? { locations: { some: { city: { name: { equals: input.city.trim(), mode: "insensitive" as const } }, deletedAt: null } } } : {}),
      ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" as const } }, { description: { contains: query, mode: "insensitive" as const } }, { services: { some: { name: { contains: query, mode: "insensitive" as const }, deletedAt: null } } }] } : {}),
    };
    const results = await this.prisma.business.findMany({
      where,
      include: { category: true, locations: { include: { city: true }, where: { deletedAt: null } }, images: { where: { deletedAt: null }, take: 1, orderBy: { orderIndex: "asc" } }, _count: { select: { reviews: true } } },
      orderBy: [{ verificationStatus: "desc" }, { name: "asc" }],
      take: 30,
    });
    await this.prisma.searchQuery.create({ data: { userId, query: query ?? "", location: input.cityId ?? input.city, resultsCount: results.length } });
    return results;
  }
}
