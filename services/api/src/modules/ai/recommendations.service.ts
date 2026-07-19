import { Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { AiIntent, AiRecommendation } from "./ai.types";
import { SearchService } from "../search/search.service";

type RecommendationInput = { query: string; cityId?: string; categoryId?: string; surface: "AI_CHAT" | "AI_SEARCH" | "HOME" };

@Injectable()
export class AiRecommendationsService {
  constructor(private readonly prisma: PrismaService, private readonly search: SearchService) {}

  async discover(input: RecommendationInput, intent: AiIntent, userId?: string) {
    const cityId = input.cityId ?? (userId ? await this.primaryCity(userId) : undefined);
    const now = new Date();
    const [businesses, offers, foodPackages] = await Promise.all([
      this.search.businesses({ query: input.query, cityId, categoryId: input.categoryId }, userId),
      this.prisma.offer.findMany({
        where: {
          deletedAt: null, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          ...(cityId ? { business: { locations: { some: { cityId, deletedAt: null } } } } : {}),
        },
        include: { business: true }, orderBy: [{ expiresAt: "asc" }, { createdAt: "desc" }], take: 5,
      }),
      intent.needs.includes("hrana") || intent.budget === "value"
        ? this.prisma.saveFoodPackage.findMany({
          where: { deletedAt: null, status: "ACTIVE", quantityAvailable: { gt: 0 }, pickupEndAt: { gt: now }, ...(cityId ? { business: { locations: { some: { cityId, deletedAt: null } } } } : {}) },
          include: { business: true }, orderBy: { pickupEndAt: "asc" }, take: 5,
        })
        : Promise.resolve([]),
    ]);

    const recommendations: AiRecommendation[] = [
      ...businesses.slice(0, 5).map((business, index) => ({
        entityType: "business" as const, entityId: business.id, title: business.name,
        subtitle: business.category?.name ?? "Lokalna firma", score: this.score(0.94, index, intent),
        reason: this.businessReason(intent), actionUrl: `/businesses/${business.slug ?? business.id}`,
      })),
      ...offers.map((offer, index) => ({
        entityType: "offer" as const, entityId: offer.id, title: offer.title,
        subtitle: `${offer.business.name} · ${offer.discountPrice ?? offer.price ?? "Ponuda"} ${offer.currency}`,
        score: this.score(0.86, index, intent), reason: intent.budget === "value" ? "Aktivna ponuda koja odgovara traženju povoljnije opcije." : "Aktivna lokalna ponuda.", actionUrl: `/app/deals/${offer.id}`,
      })),
      ...foodPackages.map((item, index) => ({
        entityType: "save_food_package" as const, entityId: item.id, title: item.title,
        subtitle: `${item.business.name} · ${item.pickupPrice} ${item.currency}`,
        score: this.score(0.9, index, intent), reason: "Dostupan Save Food paket sa važećim vremenom preuzimanja.", actionUrl: `/app/save-food/${item.id}`,
      })),
    ].sort((a, b) => b.score - a.score).slice(0, 8);

    if (userId && recommendations.length) {
      await this.prisma.recommendationEvent.createMany({
        data: recommendations.map(({ entityType, entityId, score, reason }) => ({ userId, entityType, entityId, score, reason, surface: input.surface, metadata: { intent: intent.needs, urgency: intent.urgency } })),
      });
    }
    return recommendations;
  }

  async forUser(userId: string) {
    const interests = await this.prisma.userInterest.findMany({ where: { userId }, include: { category: true }, orderBy: { score: "desc" }, take: 3 });
    const query = interests.map(({ category }) => category.name).join(" ") || "lokalne ponude";
    return this.discover({ query, surface: "HOME" }, { type: "business_discovery", needs: interests.length ? ["personalizovana preporuka"] : ["lokalna usluga"], urgency: "normal", budget: "standard", confidence: interests.length ? "medium" : "low" }, userId);
  }

  private async primaryCity(userId: string) {
    const location = await this.prisma.userLocation.findFirst({ where: { userId, isPrimary: true }, select: { cityId: true } });
    return location?.cityId;
  }

  private score(base: number, position: number, intent: AiIntent) {
    const urgencyBoost = intent.urgency === "urgent" ? 0.02 : 0;
    return Math.max(0.5, Number((base + urgencyBoost - position * 0.04).toFixed(2)));
  }

  private businessReason(intent: AiIntent) {
    return intent.urgency === "urgent"
      ? "Podudara se sa traženom uslugom; proveri dostupnost direktnim kontaktom."
      : "Podudara se sa kategorijom, uslugama i lokacijom iz zahteva.";
  }
}
