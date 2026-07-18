import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { Prisma, SaveFoodPackageStatus, SaveFoodReservationStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";
import { FeaturesService } from "../features/features.service";

export class CreateSaveFoodPackageDto {
  @IsUUID() businessId!: string;
  @IsString() @MaxLength(160) title!: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsString() @MaxLength(2048) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) originalPrice?: number;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) pickupPrice!: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @Type(() => Number) @IsInt() @Min(1) @Max(10000) quantity!: number;
  @IsDateString() pickupStartAt!: string;
  @IsDateString() pickupEndAt!: string;
}

export class UpdateSaveFoodPackageDto {
  @IsOptional() @IsString() @MaxLength(160) title?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsString() @MaxLength(2048) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) originalPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) pickupPrice?: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsOptional() @IsDateString() pickupStartAt?: string;
  @IsOptional() @IsDateString() pickupEndAt?: string;
  @IsOptional() @IsEnum(SaveFoodPackageStatus) status?: "DRAFT" | "ARCHIVED";
}

export class ListSaveFoodPackagesDto { @IsOptional() @IsUUID() cityId?: string; @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number; }
export class ReserveSaveFoodPackageDto { @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20) quantity?: number; }

@Injectable()
export class SaveFoodService {
  private readonly publicInclude = { business: { select: { id: true, name: true, slug: true, logoUrl: true, locations: { where: { deletedAt: null }, include: { city: { select: { name: true } } } } } } } satisfies Prisma.SaveFoodPackageInclude;
  constructor(private readonly prisma: PrismaService, private readonly features: FeaturesService) {}

  async list(input: ListSaveFoodPackagesDto) {
    this.requireEnabled();
    return this.prisma.saveFoodPackage.findMany({ where: { deletedAt: null, status: SaveFoodPackageStatus.ACTIVE, quantityAvailable: { gt: 0 }, pickupEndAt: { gt: new Date() }, business: { status: "VERIFIED", deletedAt: null, ...(input.cityId ? { locations: { some: { cityId: input.cityId, deletedAt: null } } } : {}) } }, include: this.publicInclude, orderBy: [{ pickupEndAt: "asc" }, { createdAt: "desc" }], take: input.limit ?? 20 });
  }

  async findPublic(id: string) {
    this.requireEnabled();
    const item = await this.prisma.saveFoodPackage.findFirst({ where: { id, deletedAt: null, status: SaveFoodPackageStatus.ACTIVE, quantityAvailable: { gt: 0 }, pickupEndAt: { gt: new Date() }, business: { status: "VERIFIED", deletedAt: null } }, include: this.publicInclude });
    if (!item) throw new NotFoundException("SAVE_FOOD_PACKAGE_NOT_FOUND");
    return item;
  }

  async create(ownerId: string, input: CreateSaveFoodPackageDto) {
    this.requireEnabled(); this.ensureInput(input.pickupStartAt, input.pickupEndAt, input.originalPrice, input.pickupPrice);
    await this.requireOwnership(input.businessId, ownerId);
    const item = await this.prisma.saveFoodPackage.create({ data: { businessId: input.businessId, title: input.title.trim(), description: input.description?.trim(), imageUrl: input.imageUrl, originalPrice: input.originalPrice, pickupPrice: input.pickupPrice, currency: input.currency?.toUpperCase() ?? "RSD", quantityTotal: input.quantity, quantityAvailable: input.quantity, pickupStartAt: new Date(input.pickupStartAt), pickupEndAt: new Date(input.pickupEndAt) }, include: this.publicInclude });
    await this.audit(ownerId, "SAVE_FOOD_PACKAGE_CREATED", item.id, { businessId: item.businessId }); return item;
  }

  async update(ownerId: string, id: string, input: UpdateSaveFoodPackageDto) {
    this.requireEnabled(); const item = await this.findOwned(id, ownerId);
    this.ensureInput(input.pickupStartAt ?? item.pickupStartAt.toISOString(), input.pickupEndAt ?? item.pickupEndAt.toISOString(), input.originalPrice ?? (item.originalPrice ? Number(item.originalPrice) : undefined), input.pickupPrice ?? Number(item.pickupPrice));
    const updated = await this.prisma.saveFoodPackage.update({ where: { id }, data: { ...input, title: input.title?.trim(), description: input.description?.trim(), currency: input.currency?.toUpperCase(), pickupStartAt: input.pickupStartAt ? new Date(input.pickupStartAt) : undefined, pickupEndAt: input.pickupEndAt ? new Date(input.pickupEndAt) : undefined }, include: this.publicInclude });
    await this.audit(ownerId, "SAVE_FOOD_PACKAGE_UPDATED", id, { businessId: item.businessId }); return updated;
  }

  async activate(ownerId: string, id: string) {
    this.requireEnabled(); const item = await this.findOwned(id, ownerId);
    if (item.pickupEndAt <= new Date() || item.pickupStartAt >= item.pickupEndAt || item.quantityAvailable < 1) throw new ConflictException("SAVE_FOOD_PACKAGE_NOT_READY");
    const updated = await this.prisma.saveFoodPackage.update({ where: { id }, data: { status: SaveFoodPackageStatus.ACTIVE }, include: this.publicInclude });
    await this.audit(ownerId, "SAVE_FOOD_PACKAGE_ACTIVATED", id, { businessId: item.businessId }); return updated;
  }

  async reserve(userId: string, id: string, quantity = 1) {
    this.requireEnabled();
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.saveFoodPackage.updateMany({ where: { id, deletedAt: null, status: SaveFoodPackageStatus.ACTIVE, quantityAvailable: { gte: quantity }, pickupEndAt: { gt: new Date() }, business: { status: "VERIFIED", deletedAt: null } }, data: { quantityAvailable: { decrement: quantity } } });
      if (updated.count !== 1) throw new ConflictException("SAVE_FOOD_PACKAGE_UNAVAILABLE");
      const reservation = await tx.saveFoodReservation.create({ data: { packageId: id, userId, quantity } });
      await tx.auditLog.create({ data: { actorUserId: userId, action: "SAVE_FOOD_RESERVED", resourceType: "save_food_reservation", resourceId: reservation.id, payload: { packageId: id, quantity } } });
      return reservation;
    });
  }

  async reservations(userId: string) {
    this.requireEnabled();
    return this.prisma.saveFoodReservation.findMany({ where: { userId }, include: { package: { include: this.publicInclude } }, orderBy: { reservedAt: "desc" } });
  }

  async cancel(userId: string, id: string) {
    this.requireEnabled();
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.saveFoodReservation.findFirst({ where: { id, userId, status: SaveFoodReservationStatus.RESERVED }, include: { package: { select: { pickupStartAt: true } } } });
      if (!reservation || reservation.package.pickupStartAt <= new Date()) throw new ConflictException("SAVE_FOOD_RESERVATION_CANNOT_BE_CANCELLED");
      const cancelled = await tx.saveFoodReservation.update({ where: { id }, data: { status: SaveFoodReservationStatus.CANCELLED, cancelledAt: new Date() } });
      await tx.saveFoodPackage.update({ where: { id: reservation.packageId }, data: { quantityAvailable: { increment: reservation.quantity }, status: SaveFoodPackageStatus.ACTIVE } });
      await tx.auditLog.create({ data: { actorUserId: userId, action: "SAVE_FOOD_RESERVATION_CANCELLED", resourceType: "save_food_reservation", resourceId: id } }); return cancelled;
    });
  }

  private requireEnabled() { if (!this.features.isEnabled("saveFood")) throw new NotFoundException("SAVE_FOOD_DISABLED"); }
  private async requireOwnership(businessId: string, ownerId: string) { const business = await this.prisma.business.findFirst({ where: { id: businessId, ownerId, deletedAt: null }, select: { id: true } }); if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED"); }
  private async findOwned(id: string, ownerId: string) { const item = await this.prisma.saveFoodPackage.findFirst({ where: { id, deletedAt: null }, select: { id: true, businessId: true, pickupStartAt: true, pickupEndAt: true, originalPrice: true, pickupPrice: true, quantityAvailable: true } }); if (!item) throw new NotFoundException("SAVE_FOOD_PACKAGE_NOT_FOUND"); await this.requireOwnership(item.businessId, ownerId); return item; }
  private ensureInput(start: string, end: string, original: number | undefined, pickup: number) { if (new Date(start) >= new Date(end)) throw new ConflictException("SAVE_FOOD_PICKUP_WINDOW_INVALID"); if (original !== undefined && pickup > original) throw new ConflictException("SAVE_FOOD_PICKUP_PRICE_INVALID"); }
  private async audit(actorUserId: string, action: string, resourceId: string, payload: Record<string, unknown>) { await this.prisma.auditLog.create({ data: { actorUserId, action, resourceType: "save_food_package", resourceId, payload: payload as Prisma.InputJsonValue } }); }
}
