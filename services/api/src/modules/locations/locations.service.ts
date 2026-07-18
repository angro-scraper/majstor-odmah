import { Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async countries() {
    return this.prisma.country.findMany({
      where: { deletedAt: null },
      select: { id: true, code: true, name: true, currency: true },
      orderBy: { name: "asc" },
    });
  }

  async cities(countryId?: string, query?: string) {
    const name = query?.trim();
    return this.prisma.city.findMany({
      where: {
        deletedAt: null,
        ...(countryId ? { countryId } : {}),
        ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      },
      select: { id: true, name: true, latitude: true, longitude: true, country: { select: { id: true, code: true, name: true } } },
      orderBy: { name: "asc" },
      take: 100,
    });
  }
}
