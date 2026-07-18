import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { OfferStatus, Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

const editableStatuses = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
type EditableOfferStatus = (typeof editableStatuses)[number];

export class CreateOfferDto {
  @IsUUID() businessId!: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsString() @MaxLength(180) title!: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsString() @MaxLength(2000) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) discountPrice?: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsEnum(editableStatuses) status?: EditableOfferStatus;
}

export class UpdateOfferDto {
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsString() @MaxLength(180) title?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsString() @MaxLength(2000) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) discountPrice?: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsEnum(editableStatuses) status?: EditableOfferStatus;
}

export class ListOffersDto {
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(50) limit?: number;
}

@Injectable()
export class OffersService {
  private readonly publicInclude = {
    business: { include: { category: true, locations: { include: { city: true }, where: { deletedAt: null } } } },
    category: true,
  } satisfies Prisma.OfferInclude;

  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, input: CreateOfferDto) {
    await this.requireOwnership(input.businessId, ownerId);
    this.ensurePriceOrder(input.price, input.discountPrice);
    const offer = await this.prisma.offer.create({
      data: {
        businessId: input.businessId,
        categoryId: input.categoryId,
        title: input.title.trim(),
        description: input.description?.trim(),
        imageUrl: input.imageUrl,
        price: input.price,
        discountPrice: input.discountPrice,
        currency: input.currency?.toUpperCase() ?? "RSD",
        startsAt: input.startsAt ? new Date(input.startsAt) : null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        status: input.status ?? OfferStatus.DRAFT,
      },
      include: this.publicInclude,
    });
    await this.prisma.auditLog.create({ data: { actorUserId: ownerId, action: "OFFER_CREATED", resourceType: "offer", resourceId: offer.id } });
    return offer;
  }

  async update(id: string, ownerId: string, input: UpdateOfferDto) {
    const offer = await this.prisma.offer.findFirst({ where: { id, deletedAt: null }, select: { businessId: true, price: true, discountPrice: true } });
    if (!offer) throw new NotFoundException("OFFER_NOT_FOUND");
    await this.requireOwnership(offer.businessId, ownerId);
    this.ensurePriceOrder(input.price ?? Number(offer.price ?? 0), input.discountPrice ?? (offer.discountPrice ? Number(offer.discountPrice) : undefined));
    const updated = await this.prisma.offer.update({
      where: { id },
      data: {
        ...input,
        title: input.title?.trim(),
        description: input.description?.trim(),
        currency: input.currency?.toUpperCase(),
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      },
      include: this.publicInclude,
    });
    await this.prisma.auditLog.create({ data: { actorUserId: ownerId, action: "OFFER_UPDATED", resourceType: "offer", resourceId: id } });
    return updated;
  }

  async findPublic(id: string) {
    const offer = await this.prisma.offer.findFirst({ where: { id, deletedAt: null, status: OfferStatus.ACTIVE, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, include: this.publicInclude });
    if (!offer) throw new NotFoundException("OFFER_NOT_FOUND");
    return offer;
  }

  async listActive(input: ListOffersDto) {
    return this.prisma.offer.findMany({
      where: {
        deletedAt: null,
        status: OfferStatus.ACTIVE,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        ...(input.cityId ? { business: { locations: { some: { cityId: input.cityId, deletedAt: null } } } } : {}),
      },
      include: this.publicInclude,
      orderBy: [{ expiresAt: "asc" }, { createdAt: "desc" }],
      take: input.limit ?? 20,
    });
  }

  async save(userId: string, offerId: string) {
    await this.findPublic(offerId);
    const existing = await this.prisma.favorite.findFirst({ where: { userId, offerId, deletedAt: null } });
    if (existing) return existing;
    return this.prisma.favorite.create({ data: { userId, offerId } });
  }

  private async requireOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, ownerId, deletedAt: null }, select: { id: true } });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");
  }

  private ensurePriceOrder(price?: number, discountPrice?: number) {
    if (price !== undefined && discountPrice !== undefined && discountPrice > price) throw new ForbiddenException("DISCOUNT_PRICE_MUST_NOT_EXCEED_PRICE");
  }
}
