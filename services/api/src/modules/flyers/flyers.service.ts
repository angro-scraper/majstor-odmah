import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FlyerStatus, Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, IsUrl, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { FeaturesService } from "../features/features.service";

export class FlyerPageDto {
  @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl!: string;
  @IsInt() @Min(1) pageNumber!: number;
}

export class CreateFlyerDto {
  @IsUUID() businessId!: string;
  @IsString() @MaxLength(160) title!: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) actionUrl?: string;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => FlyerPageDto) pages?: FlyerPageDto[];
}

export class UpdateFlyerDto {
  @IsOptional() @IsString() @MaxLength(160) title?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) imageUrl?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) actionUrl?: string;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() @IsEnum(FlyerStatus) status?: FlyerStatus;
  @IsOptional() @IsArray() @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => FlyerPageDto) pages?: FlyerPageDto[];
}

export class ListFlyersDto {
  @IsOptional() @IsUUID() businessId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @Type(() => Number) @Min(1) @Max(50) limit?: number;
}

@Injectable()
export class FlyersService {
  private readonly publicInclude = { business: { select: { id: true, name: true, slug: true, logoUrl: true, verificationStatus: true, locations: { where: { deletedAt: null }, include: { city: { select: { name: true } } } } } }, pages: { orderBy: { pageNumber: "asc" as const } }, _count: { select: { views: true } } } satisfies Prisma.DigitalFlyerInclude;

  constructor(private readonly prisma: PrismaService, private readonly features: FeaturesService) {}

  async list(input: ListFlyersDto) {
    this.requireEnabled();
    return this.prisma.digitalFlyer.findMany({
      where: { deletedAt: null, status: FlyerStatus.PUBLISHED, ...(input.businessId ? { businessId: input.businessId } : {}), ...(input.cityId ? { business: { locations: { some: { cityId: input.cityId, deletedAt: null } } } } : {}), business: { status: "VERIFIED", deletedAt: null }, OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }], AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }] },
      include: this.publicInclude, orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }], take: input.limit ?? 20,
    });
  }

  async findPublic(id: string) {
    this.requireEnabled();
    const flyer = await this.prisma.digitalFlyer.findFirst({ where: { id, deletedAt: null, status: FlyerStatus.PUBLISHED, business: { status: "VERIFIED", deletedAt: null }, OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }], AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }] }, include: this.publicInclude });
    if (!flyer) throw new NotFoundException("FLYER_NOT_FOUND");
    return flyer;
  }

  async create(ownerId: string, input: CreateFlyerDto) {
    this.requireEnabled();
    this.ensureDates(input.startsAt, input.expiresAt);
    await this.requireOwnership(input.businessId, ownerId);
    const flyer = await this.prisma.digitalFlyer.create({ data: { businessId: input.businessId, title: input.title.trim(), description: input.description?.trim(), imageUrl: input.imageUrl, actionUrl: input.actionUrl, startsAt: input.startsAt ? new Date(input.startsAt) : null, expiresAt: input.expiresAt ? new Date(input.expiresAt) : null, pages: input.pages ? { create: input.pages.map((page) => ({ imageUrl: page.imageUrl, pageNumber: page.pageNumber })) } : undefined }, include: this.publicInclude });
    await this.audit(ownerId, "FLYER_CREATED", flyer.id, { businessId: flyer.businessId });
    return flyer;
  }

  async update(ownerId: string, id: string, input: UpdateFlyerDto) {
    this.requireEnabled();
    const flyer = await this.prisma.digitalFlyer.findFirst({ where: { id, deletedAt: null }, select: { id: true, businessId: true, startsAt: true, expiresAt: true } });
    if (!flyer) throw new NotFoundException("FLYER_NOT_FOUND");
    await this.requireOwnership(flyer.businessId, ownerId);
    this.ensureDates(input.startsAt ?? flyer.startsAt?.toISOString(), input.expiresAt ?? flyer.expiresAt?.toISOString());
    const { pages, startsAt, expiresAt, ...fields } = input;
    const updated = await this.prisma.digitalFlyer.update({ where: { id }, data: { ...fields, title: input.title?.trim(), description: input.description?.trim(), startsAt: startsAt ? new Date(startsAt) : undefined, expiresAt: expiresAt ? new Date(expiresAt) : undefined, pages: pages === undefined ? undefined : { deleteMany: {}, create: pages.map((page) => ({ imageUrl: page.imageUrl, pageNumber: page.pageNumber })) } }, include: this.publicInclude });
    await this.audit(ownerId, "FLYER_UPDATED", id, { businessId: flyer.businessId, status: updated.status });
    return updated;
  }

  async publish(ownerId: string, id: string) {
    return this.update(ownerId, id, { status: FlyerStatus.PUBLISHED });
  }

  async recordView(userId: string, id: string) {
    await this.findPublic(id);
    return this.prisma.flyerView.create({ data: { flyerId: id, userId, source: "web" } });
  }

  private requireEnabled() { if (!this.features.isEnabled("digitalFlyers")) throw new NotFoundException("DIGITAL_FLYERS_DISABLED"); }

  private async requireOwnership(businessId: string, ownerId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, ownerId, deletedAt: null }, select: { id: true } });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");
  }

  private ensureDates(startsAt?: string, expiresAt?: string) {
    if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) throw new ForbiddenException("FLYER_EXPIRY_MUST_FOLLOW_START");
  }

  private async audit(actorUserId: string, action: string, resourceId: string, payload: Record<string, unknown>) {
    await this.prisma.auditLog.create({ data: { actorUserId, action, resourceType: "digital_flyer", resourceId, payload: payload as Prisma.InputJsonValue } });
  }
}
