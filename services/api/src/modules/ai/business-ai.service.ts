import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsUUID } from "class-validator";
import { AiModerationService } from "./moderation.service";

export class BusinessAiAnalysisDto { @IsUUID() businessId!: string; }

@Injectable()
export class BusinessAiService {
  constructor(private readonly prisma: PrismaService, private readonly moderation: AiModerationService) {}

  async analyze(ownerId: string, input: BusinessAiAnalysisDto) {
    const business = await this.prisma.business.findFirst({
      where: { id: input.businessId, ownerId, deletedAt: null },
      include: { services: { where: { deletedAt: null } }, locations: { where: { deletedAt: null } }, images: { where: { deletedAt: null } } },
    });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");

    const since = new Date(); since.setDate(since.getDate() - 30);
    const [activeOffers, activeFoodPackages, views, contacts] = await Promise.all([
      this.prisma.offer.count({ where: { businessId: business.id, status: "ACTIVE", deletedAt: null } }),
      this.prisma.saveFoodPackage.count({ where: { businessId: business.id, status: "ACTIVE", deletedAt: null } }),
      this.prisma.businessView.count({ where: { businessId: business.id, createdAt: { gte: since } } }),
      this.prisma.contactEvent.count({ where: { businessId: business.id, createdAt: { gte: since } } }),
    ]);
    const suggestions = [
      !business.description && { area: "profil", priority: "high", suggestion: "Dodajte kratak opis firme i glavne usluge da bi pretraga imala dovoljno javnih podataka." },
      !business.locations.length && { area: "profil", priority: "high", suggestion: "Dodajte lokaciju da bi vas lokalna pretraga i Balkan AI mogli preporučiti u gradu." },
      !business.services.length && { area: "otkrivanje", priority: "medium", suggestion: "Dodajte konkretne usluge; AI pretraga se oslanja na naziv i opis usluge." },
      activeOffers === 0 && { area: "marketing", priority: "medium", suggestion: "Nema aktivnih ponuda. Kreirajte vremenski ograničenu ponudu sa jasnom cenom i datumom isteka." },
      activeFoodPackages === 0 && { area: "save_food", priority: "low", suggestion: "Ako imate kvarljivi višak, Save Food paket može povećati vidljivost bez automatskog objavljivanja." },
      views > 20 && contacts === 0 && { area: "konverzija", priority: "medium", suggestion: "Profil ima preglede, ali nema kontakata. Proverite telefon, radno vreme i jasnoću glavnog poziva na akciju." },
    ].filter(Boolean);
    await this.moderation.audit(ownerId, "AI_BUSINESS_ANALYSIS_COMPLETED", "business", { businessId: business.id, suggestionCount: suggestions.length });
    return { businessId: business.id, periodDays: 30, signals: { views, contacts, activeOffers, activeFoodPackages }, suggestions, guardrails: ["Predlozi ne menjaju poslovne podatke automatski.", "Finansijske i promotivne akcije zahtevaju potvrdu vlasnika firme."] };
  }
}
