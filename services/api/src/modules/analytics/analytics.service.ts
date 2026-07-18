import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsIn, IsObject, IsOptional, IsUUID } from "class-validator";

export const ANALYTICS_EVENT_TYPES = ["USER_REGISTERED", "BUSINESS_CREATED", "OFFER_CREATED", "OFFER_VIEWED", "OFFER_SAVED", "SEARCH_COMPLETED", "FOOD_PACKAGE_RESERVED", "NOTIFICATION_OPENED", "BUSINESS_VIEWED", "BUSINESS_CONTACTED"] as const;
type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

const EVENT_METADATA_FIELDS: Record<AnalyticsEventType, readonly string[]> = {
  USER_REGISTERED: ["source"], BUSINESS_CREATED: ["source"], OFFER_CREATED: ["source"], OFFER_VIEWED: ["source"], OFFER_SAVED: ["source"],
  SEARCH_COMPLETED: ["resultsCount", "categoryId", "cityId"], FOOD_PACKAGE_RESERVED: ["quantity"], NOTIFICATION_OPENED: ["notificationType"],
  BUSINESS_VIEWED: ["source"], BUSINESS_CONTACTED: ["contactType"],
};

export class TrackEventDto {
  @IsIn(ANALYTICS_EVENT_TYPES) eventType!: AnalyticsEventType;
  @IsOptional() @IsUUID() businessId?: string;
  @IsOptional() @IsUUID() offerId?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async track(userId: string, input: TrackEventDto) {
    const eventType = input.eventType;
    return this.prisma.event.create({
      data: {
        userId,
        businessId: input.businessId,
        offerId: input.offerId,
        eventType,
        metadata: this.sanitizeMetadata(eventType, input.metadata),
      },
    });
  }

  async userSummary(userId: string) {
    const since = new Date(); since.setDate(since.getDate() - 30);
    const [searches, savedBusinesses, savedOffers, contacts, reviews, recentEvents] = await Promise.all([
      this.prisma.searchQuery.count({ where: { userId, createdAt: { gte: since } } }),
      this.prisma.favorite.count({ where: { userId, businessId: { not: null }, deletedAt: null } }),
      this.prisma.favorite.count({ where: { userId, offerId: { not: null }, deletedAt: null } }),
      this.prisma.contactEvent.count({ where: { userId, createdAt: { gte: since } } }),
      this.prisma.review.count({ where: { userId, deletedAt: null } }),
      this.prisma.event.findMany({ where: { userId, createdAt: { gte: since }, deletedAt: null }, select: { eventType: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 10 }),
    ]);
    return { periodDays: 30, searches, savedBusinesses, savedOffers, contacts, reviews, recentActivity: recentEvents };
  }

  async platformSummary() {
    const since = new Date(); since.setDate(since.getDate() - 30);
    const [users, activeUsers, businesses, verifiedBusinesses, activeOffers, searches, contacts, reservations] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null, lastLoginAt: { gte: since } } }),
      this.prisma.business.count({ where: { deletedAt: null } }),
      this.prisma.business.count({ where: { deletedAt: null, status: "VERIFIED" } }),
      this.prisma.offer.count({ where: { deletedAt: null, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
      this.prisma.searchQuery.count({ where: { createdAt: { gte: since } } }),
      this.prisma.contactEvent.count({ where: { createdAt: { gte: since } } }),
      this.prisma.saveFoodReservation.count({ where: { createdAt: { gte: since } } }),
    ]);
    return { periodDays: 30, users, activeUsers, businesses, verifiedBusinesses, activeOffers, successfulConnections: contacts, searches, saveFoodReservations: reservations };
  }

  async businessMetrics(ownerId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, ownerId, deletedAt: null }, select: { id: true } });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");
    const [views, contacts, approvedReviews, favoriteCount, followerCount, activeOffers, publishedFlyers, flyerViews, activeSaveFoodPackages, saveFoodReservations] = await Promise.all([
      this.prisma.businessView.count({ where: { businessId } }),
      this.prisma.contactEvent.count({ where: { businessId } }),
      this.prisma.review.count({ where: { businessId, status: "APPROVED", deletedAt: null } }),
      this.prisma.favorite.count({ where: { businessId, deletedAt: null } }),
      this.prisma.businessFollower.count({ where: { businessId } }),
      this.prisma.offer.count({ where: { businessId, status: "ACTIVE", deletedAt: null } }),
      this.prisma.digitalFlyer.count({ where: { businessId, status: "PUBLISHED", deletedAt: null } }),
      this.prisma.flyerView.count({ where: { flyer: { businessId, deletedAt: null } } }),
      this.prisma.saveFoodPackage.count({ where: { businessId, status: "ACTIVE", deletedAt: null } }),
      this.prisma.saveFoodReservation.count({ where: { package: { businessId, deletedAt: null }, status: { in: ["RESERVED", "PICKED_UP"] } } }),
    ]);
    return { businessId, views, contacts, approvedReviews, favorites: favoriteCount, followers: followerCount, activeOffers, publishedFlyers, flyerViews, activeSaveFoodPackages, saveFoodReservations };
  }

  async businessInsights(ownerId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, ownerId, deletedAt: null },
      include: { locations: { where: { deletedAt: null } }, images: { where: { deletedAt: null } }, services: { where: { deletedAt: null } } },
    });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");

    const checks = [
      { key: "description", complete: Boolean(business.description?.trim()), message: "Dodaj jasan opis usluga koje nudiš." },
      { key: "contact", complete: Boolean(business.phone || business.email || business.website), message: "Dodaj barem jedan kontakt kanal za potencijalne klijente." },
      { key: "location", complete: business.locations.length > 0, message: "Dodaj lokaciju da bi te lokalni korisnici pronašli." },
      { key: "services", complete: business.services.length > 0, message: "Dodaj usluge kako bi pretraga bolje razumela tvoju firmu." },
      { key: "images", complete: business.images.length >= 3, message: "Dodaj još fotografija: kompletni profili grade više poverenja." },
      { key: "verified", complete: business.verificationStatus === "VERIFIED", message: "Pošalji profil na verifikaciju radi većeg poverenja." },
    ];
    const completed = checks.filter((check) => check.complete).length;
    const profileScore = Math.round((completed / checks.length) * 100);
    return {
      businessId,
      profileScore,
      status: business.verificationStatus,
      suggestions: checks.filter((check) => !check.complete).map(({ key, message }) => ({ key, message })),
      coachMessage: profileScore >= 85
        ? "Profil izgleda spremno za veću vidljivost. Nastavi da ažuriraš ponude i odgovaraš na korisnike."
        : "Poboljšaj označene stavke da bi korisnici lakše pronašli i izabrali tvoju firmu.",
    };
  }

  private sanitizeMetadata(eventType: AnalyticsEventType, metadata: Record<string, unknown> | undefined): Prisma.InputJsonValue {
    const allowed = EVENT_METADATA_FIELDS[eventType];
    const sanitized: Record<string, string | number | boolean> = {};
    for (const key of allowed) {
      const value = metadata?.[key];
      if (typeof value === "string" && value.length <= 160) sanitized[key] = value;
      else if (typeof value === "number" && Number.isFinite(value)) sanitized[key] = value;
      else if (typeof value === "boolean") sanitized[key] = value;
    }
    if (metadata && Object.keys(metadata).some((key) => !allowed.includes(key))) throw new BadRequestException("ANALYTICS_METADATA_FIELD_NOT_ALLOWED");
    return sanitized as Prisma.InputJsonValue;
  }
}
