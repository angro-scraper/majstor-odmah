import { ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class TrackEventDto {
  @IsString() @MaxLength(100) eventType!: string;
  @IsOptional() @IsUUID() businessId?: string;
  @IsOptional() @IsUUID() offerId?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async track(userId: string, input: TrackEventDto) {
    return this.prisma.event.create({
      data: {
        userId,
        businessId: input.businessId,
        offerId: input.offerId,
        eventType: input.eventType.trim().toUpperCase(),
        metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
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
}
