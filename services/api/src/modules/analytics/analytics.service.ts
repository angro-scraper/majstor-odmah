import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsIn, IsObject, IsOptional, IsUUID } from "class-validator";

/**
 * The platform's stable, privacy-reviewed event vocabulary.
 *
 * New product surfaces must use one of these names (or add one here with an
 * explicit metadata allow-list) instead of creating ad-hoc analytics data.
 */
export const ANALYTICS_EVENT_TYPES = [
  "USER_REGISTERED", "BUSINESS_CREATED", "OFFER_CREATED", "OFFER_VIEWED", "OFFER_SAVED", "SEARCH_COMPLETED",
  "DEAL_VIEWED", "FLYER_OPENED", "SAVE_FOOD_RESERVED", "SAVE_FOOD_PICKED_UP", "PAYMENT_COMPLETED",
  "NOTIFICATION_OPENED", "BUSINESS_VIEWED", "BUSINESS_CONTACTED", "BUSINESS_FOLLOWED", "REVIEW_CREATED",
  "SERVICE_REQUEST_CREATED", "BOOKING_CREATED", "JOB_APPLIED", "MARKETPLACE_ITEM_VIEWED", "MODULE_OPENED",
  "RECOMMENDATION_CLICKED", "REWARD_GRANTED", "REFERRAL_COMPLETED", "DAILY_CHECK_IN",
] as const;
type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

const EVENT_METADATA_FIELDS: Record<AnalyticsEventType, readonly string[]> = {
  USER_REGISTERED: ["source"], BUSINESS_CREATED: ["source"], OFFER_CREATED: ["source"], OFFER_VIEWED: ["source"], OFFER_SAVED: ["source"],
  SEARCH_COMPLETED: ["resultsCount", "categoryId", "cityId"], DEAL_VIEWED: ["dealId", "source"], FLYER_OPENED: ["flyerId", "source"],
  SAVE_FOOD_RESERVED: ["packageId", "quantity"], SAVE_FOOD_PICKED_UP: ["packageId", "quantity"],
  PAYMENT_COMPLETED: ["paymentId", "amount", "currency", "module"], NOTIFICATION_OPENED: ["notificationType", "module"],
  BUSINESS_VIEWED: ["source"], BUSINESS_CONTACTED: ["contactType"], BUSINESS_FOLLOWED: ["businessId"],
  REVIEW_CREATED: ["rating", "targetType"], SERVICE_REQUEST_CREATED: ["categoryId", "cityId"], BOOKING_CREATED: ["serviceId"],
  JOB_APPLIED: ["jobId"], MARKETPLACE_ITEM_VIEWED: ["itemId", "categoryId"], MODULE_OPENED: ["module"],
  RECOMMENDATION_CLICKED: ["entityType", "entityId", "surface"], REWARD_GRANTED: ["eventType", "points"],
  REFERRAL_COMPLETED: ["source"], DAILY_CHECK_IN: ["streakDay"],
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

  /** Engagement data for a user-facing privacy centre and personalized home. */
  async userIntelligence(userId: string) {
    const since = this.sinceDays(30);
    const [events, interests, summary] = await Promise.all([
      this.prisma.event.findMany({
        where: { userId, createdAt: { gte: since }, deletedAt: null },
        select: { eventType: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 1000,
      }),
      this.prisma.userInterest.findMany({ where: { userId }, include: { category: { select: { id: true, name: true } } }, orderBy: { score: "desc" }, take: 5 }),
      this.userSummary(userId),
    ]);
    const breakdown = this.eventBreakdown(events);
    const activeDays = new Set(events.map(({ createdAt }) => createdAt.toISOString().slice(0, 10))).size;
    const segments = this.userSegments(breakdown, interests.length, summary);

    return {
      periodDays: 30,
      activeDays,
      eventCount: events.length,
      eventBreakdown: breakdown,
      interests: interests.map(({ category, score }) => ({ id: category.id, name: category.name, score })),
      segments,
      personalization: {
        enabled: true,
        inputs: ["izabrane kategorije", "sačuvane stavke", "potvrđene aktivnosti", "izabrana lokacija"],
        controls: { export: "/api/v1/compliance/data-export", dataRequests: "/api/v1/compliance/data-requests" },
      },
    };
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

  /**
   * Region-level aggregates intentionally contain no individual profiles,
   * prompts, search text, or device identifiers. They are safe for the admin
   * regional dashboard and future aggregated market reports.
   */
  async regionalSummary(countryCode?: string) {
    const since = this.sinceDays(30);
    const [countries, profileCounts, cities, businesses, events] = await Promise.all([
      this.prisma.country.findMany({
        where: { deletedAt: null, ...(countryCode ? { code: countryCode.toUpperCase() } : {}) },
        select: { id: true, code: true, name: true, currency: true, isActive: true }, orderBy: { name: "asc" },
      }),
      this.prisma.profile.groupBy({ by: ["countryId"], where: { deletedAt: null, countryId: { not: null } }, _count: { _all: true } }),
      this.prisma.city.findMany({ where: { deletedAt: null }, select: { id: true, countryId: true } }),
      this.prisma.business.findMany({ where: { deletedAt: null }, select: { id: true, status: true, locations: { where: { deletedAt: null }, select: { cityId: true } } } }),
      this.prisma.event.findMany({ where: { createdAt: { gte: since }, deletedAt: null, businessId: { not: null } }, select: { businessId: true, eventType: true } }),
    ]);
    const countryByCity = new Map(cities.map((city) => [city.id, city.countryId]));
    const userCounts = new Map(profileCounts.map((item) => [item.countryId as string, item._count._all]));
    const businessCountry = new Map<string, string>();
    const totals = new Map(countries.map((country) => [country.id, { businesses: 0, verifiedBusinesses: 0, events: 0, eventBreakdown: {} as Record<string, number> }]));

    for (const business of businesses) {
      const countryId = business.locations.map((location) => countryByCity.get(location.cityId)).find(Boolean);
      if (!countryId || !totals.has(countryId)) continue;
      businessCountry.set(business.id, countryId);
      const total = totals.get(countryId)!;
      total.businesses += 1;
      if (business.status === "VERIFIED") total.verifiedBusinesses += 1;
    }
    for (const event of events) {
      const countryId = event.businessId ? businessCountry.get(event.businessId) : undefined;
      if (!countryId || !totals.has(countryId)) continue;
      const total = totals.get(countryId)!;
      total.events += 1;
      total.eventBreakdown[event.eventType] = (total.eventBreakdown[event.eventType] ?? 0) + 1;
    }

    return {
      periodDays: 30,
      generatedAt: new Date(),
      privacy: "Aggregated data only; no private search text or user-level rows are included.",
      countries: countries.map((country) => ({
        code: country.code, name: country.name, currency: country.currency, active: country.isActive,
        users: userCounts.get(country.id) ?? 0, ...(totals.get(country.id) ?? { businesses: 0, verifiedBusinesses: 0, events: 0, eventBreakdown: {} }),
      })),
    };
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

  async businessReport(ownerId: string, businessId: string) {
    const [metrics, events] = await Promise.all([
      this.businessMetrics(ownerId, businessId),
      this.prisma.event.findMany({
        where: { businessId, createdAt: { gte: this.sinceDays(30) }, deletedAt: null },
        select: { eventType: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 1000,
      }),
    ]);
    const conversionRate = metrics.views === 0 ? 0 : Number(((metrics.contacts / metrics.views) * 100).toFixed(2));
    return {
      report: "BUSINESS_PERFORMANCE",
      periodDays: 30,
      generatedAt: new Date(),
      metrics: { ...metrics, contactConversionRate: conversionRate },
      eventBreakdown: this.eventBreakdown(events),
      insights: [
        metrics.views === 0 ? "Nema zabeleženih pregleda u dostupnim signalima. Podeli javni profil i dodaj lokaciju." : null,
        metrics.views > 0 && metrics.contacts === 0 ? "Profil se pregleda, ali nema kontakata. Proveri radno vreme, telefon i glavni poziv na akciju." : null,
        metrics.activeOffers === 0 ? "Nema aktivnih ponuda. Vremenski ograničena ponuda može povećati interesovanje." : null,
        metrics.activeSaveFoodPackages === 0 ? "Ako firma ima kvarljivi višak, Save Food paket je dodatni kanal bez automatskog objavljivanja." : null,
      ].filter(Boolean),
    };
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

  private sinceDays(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return since;
  }

  private eventBreakdown(events: Array<{ eventType: string }>) {
    return events.reduce<Record<string, number>>((counts, event) => {
      counts[event.eventType] = (counts[event.eventType] ?? 0) + 1;
      return counts;
    }, {});
  }

  private userSegments(
    events: Record<string, number>,
    interestCount: number,
    summary: { searches: number; savedOffers: number; savedBusinesses: number; contacts: number },
  ) {
    const segments: string[] = [];
    if ((events.SAVE_FOOD_RESERVED ?? 0) + (events.SAVE_FOOD_PICKED_UP ?? 0) > 0) segments.push("SAVE_FOOD_ACTIVE");
    if ((events.DEAL_VIEWED ?? 0) + summary.savedOffers > 2) segments.push("DEAL_EXPLORER");
    if (summary.searches + summary.savedBusinesses + summary.contacts > 3) segments.push("LOCAL_EXPLORER");
    if (interestCount > 0 && !segments.length) segments.push("PERSONALIZED_DISCOVERY");
    return segments.length ? segments : ["NEW_OR_LOW_ACTIVITY"];
  }
}
