import { Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async countries() {
    return this.prisma.country.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        currency: true,
        defaultLanguage: true,
        timezone: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async currencies() {
    return this.prisma.currency.findMany({
      where: { isActive: true },
      select: { code: true, symbol: true, exchangeRate: true },
      orderBy: { code: "asc" },
    });
  }

  languages() {
    return [
      { code: "sr", name: "Serbian", nativeName: "Srpski" },
      { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
      { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
      { code: "cnr", name: "Montenegrin", nativeName: "Crnogorski" },
      { code: "mk", name: "Macedonian", nativeName: "Македонски" },
      { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
      { code: "sq", name: "Albanian", nativeName: "Shqip" },
      { code: "en", name: "English", nativeName: "English" },
    ];
  }

  async translations(language: string, countryId?: string) {
    return this.prisma.translation.findMany({
      where: { language, ...(countryId ? { countryId } : { countryId: null }) },
      select: { key: true, value: true, language: true, countryId: true },
      orderBy: { key: "asc" },
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
