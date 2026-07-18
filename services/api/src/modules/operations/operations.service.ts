import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async businessOnboarding(ownerId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, ownerId, deletedAt: null },
      include: { locations: { where: { deletedAt: null } }, services: { where: { deletedAt: null } }, images: { where: { deletedAt: null } }, offers: { where: { deletedAt: null } } },
    });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");

    const steps = [
      { key: "profile", label: "Osnovni podaci", complete: Boolean(business.name && business.description && (business.phone || business.email)) },
      { key: "location", label: "Lokacija", complete: business.locations.length > 0 },
      { key: "services", label: "Usluge", complete: business.services.length > 0 },
      { key: "images", label: "Fotografije", complete: business.images.length >= 3 },
      { key: "verification", label: "Verifikacija", complete: business.verificationStatus === "VERIFIED" },
      { key: "offer", label: "Prva ponuda", complete: business.offers.some((offer) => offer.status === "ACTIVE") },
    ];
    const completed = steps.filter((step) => step.complete).length;
    const nextStep = steps.find((step) => !step.complete);
    return {
      businessId,
      completionPercent: Math.round((completed / steps.length) * 100),
      status: business.status,
      steps,
      nextAction: nextStep ? `Završi korak „${nextStep.label}“ da bi profil imao veću vidljivost.` : "Onboarding je završen. Nastavi da pratiš rezultate i ažuriraš ponude.",
    };
  }

  async dailyBrief() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const [newUsers, newBusinesses, searches, contacts, activeOffers, pendingBusinesses, pendingReviews, unreadNotifications] = await Promise.all([
      this.prisma.user.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.business.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.searchQuery.count({ where: { createdAt: { gte: start }, deletedAt: null } }),
      this.prisma.contactEvent.count({ where: { createdAt: { gte: start } } }),
      this.prisma.offer.count({ where: { status: "ACTIVE", deletedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
      this.prisma.business.count({ where: { status: "PENDING", deletedAt: null } }),
      this.prisma.review.count({ where: { status: "PENDING", deletedAt: null } }),
      this.prisma.notification.count({ where: { readAt: null, deletedAt: null } }),
    ]);
    return {
      generatedAt: new Date(),
      today: { newUsers, newBusinesses, searches, contacts },
      queues: { pendingBusinesses, pendingReviews, unreadNotifications },
      supply: { activeOffers },
      priorities: [
        ...(pendingBusinesses ? [{ type: "BUSINESS_VERIFICATION", count: pendingBusinesses, label: "Proveri nove poslovne profile" }] : []),
        ...(pendingReviews ? [{ type: "REVIEW_MODERATION", count: pendingReviews, label: "Moderiraj recenzije na čekanju" }] : []),
        ...(!pendingBusinesses && !pendingReviews ? [{ type: "GROWTH", count: 0, label: "Nema otvorenih moderacionih redova — fokus na aktivaciju firmi i korisnika." }] : []),
      ],
    };
  }

  async cityReadiness() {
    const locations = await this.prisma.businessLocation.findMany({
      where: { deletedAt: null, business: { deletedAt: null } },
      select: { city: { select: { id: true, name: true, country: { select: { code: true, name: true } } } }, business: { select: { status: true, verificationStatus: true } } },
    });
    const cities = new Map<string, { cityId: string; city: string; country: string; businesses: number; verified: number }>();
    for (const location of locations) {
      const current = cities.get(location.city.id) ?? { cityId: location.city.id, city: location.city.name, country: location.city.country.name, businesses: 0, verified: 0 };
      current.businesses += 1;
      if (location.business.status === "VERIFIED" && location.business.verificationStatus === "VERIFIED") current.verified += 1;
      cities.set(location.city.id, current);
    }
    return [...cities.values()].map((city) => ({
      ...city,
      verifiedRate: city.businesses ? Math.round((city.verified / city.businesses) * 100) : 0,
      launchReady: city.businesses >= 100 && city.verified >= 60,
      nextAction: city.businesses < 100 ? "Dovesti još kvalitetnih firmi." : city.verified < 60 ? "Povećati verifikaciju i kvalitet profila." : "Spreman za kontrolisanu lokalnu kampanju.",
    })).sort((a, b) => b.businesses - a.businesses);
  }
}
