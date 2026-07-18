import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ReviewStatus, RewardEventType } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsEmail, IsLatitude, IsLongitude, IsObject, IsOptional, IsPhoneNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import { RewardsService } from "../rewards/rewards.service";

export class CreateBusinessDto {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsUUID() categoryId!: string;
  @IsUUID() cityId!: string;
  @IsOptional() @IsString() @MaxLength(300) address?: string;
  @IsOptional() @IsLatitude() latitude?: number;
  @IsOptional() @IsLongitude() longitude?: number;
  @IsOptional() @IsPhoneNumber() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) coverUrl?: string;
  @IsOptional() @IsObject() socialLinks?: Record<string, unknown>;
  @IsOptional() @IsObject() openingHours?: Record<string, unknown>;
}

export class UpdateBusinessDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsPhoneNumber() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(2048) coverUrl?: string;
  @IsOptional() @IsObject() socialLinks?: Record<string, unknown>;
  @IsOptional() @IsObject() openingHours?: Record<string, unknown>;
}

export class CreateServiceDto {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() @MaxLength(100) priceRange?: string;
}

export class ListBusinessesDto {
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @Type(() => Number) @Min(1) @Max(50) limit?: number;
}

@Injectable()
export class BusinessesService {
  private readonly detailInclude = {
    category: true,
    locations: { include: { city: true }, where: { deletedAt: null } },
    services: { where: { deletedAt: null }, orderBy: { name: "asc" as const } },
    images: { where: { deletedAt: null }, orderBy: { orderIndex: "asc" as const } },
    reviews: { where: { status: ReviewStatus.APPROVED, deletedAt: null }, orderBy: { createdAt: "desc" as const }, take: 10 },
    _count: { select: { reviews: true, favorites: true, followers: true } },
  } satisfies Prisma.BusinessInclude;

  constructor(private readonly prisma: PrismaService, private readonly rewards: RewardsService) {}

  async create(ownerId: string, input: CreateBusinessDto) {
    const slug = await this.nextSlug(input.name);
    return this.prisma.business.create({
      data: {
        ownerId,
        slug,
        name: input.name.trim(),
        description: input.description?.trim(),
        categoryId: input.categoryId,
        phone: input.phone,
        email: input.email?.toLowerCase(),
        website: input.website,
        coverUrl: input.coverUrl,
        socialLinks: (input.socialLinks ?? {}) as Prisma.InputJsonValue,
        openingHours: (input.openingHours ?? {}) as Prisma.InputJsonValue,
        locations: { create: { cityId: input.cityId, address: input.address, latitude: input.latitude, longitude: input.longitude } },
      },
      include: this.detailInclude,
    });
  }

  async findPublic(id: string) {
    const business = await this.prisma.business.findFirst({ where: { id, deletedAt: null, status: "VERIFIED" }, include: this.detailInclude });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    return business;
  }

  async findPublicBySlug(slug: string) {
    const business = await this.prisma.business.findFirst({
      where: { slug: slug.trim().toLowerCase(), deletedAt: null, status: "VERIFIED" },
      include: this.detailInclude,
    });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    return business;
  }

  async listPublic(input: ListBusinessesDto) {
    return this.prisma.business.findMany({
      where: {
        deletedAt: null,
        status: "VERIFIED",
        ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        ...(input.cityId ? { locations: { some: { cityId: input.cityId, deletedAt: null } } } : {}),
      },
      include: {
        category: true,
        locations: { include: { city: true }, where: { deletedAt: null } },
        images: { where: { deletedAt: null }, orderBy: { orderIndex: "asc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: [{ verificationStatus: "desc" }, { name: "asc" }],
      take: input.limit ?? 20,
    });
  }

  async findOwned(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({ where: { id, ownerId: userId, deletedAt: null }, include: this.detailInclude });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    return business;
  }

  async update(id: string, userId: string, input: UpdateBusinessDto) {
    await this.findOwned(id, userId);
    const { categoryId, openingHours, socialLinks, ...fields } = input;
    const data: Prisma.BusinessUpdateInput = { ...fields };
    if (openingHours !== undefined) data.openingHours = openingHours as unknown as Prisma.InputJsonValue;
    if (socialLinks !== undefined) data.socialLinks = socialLinks as Prisma.InputJsonValue;
    if (input.name) data.name = input.name.trim();
    if (input.description) data.description = input.description.trim();
    if (input.email) data.email = input.email.toLowerCase();
    if (categoryId) data.category = { connect: { id: categoryId } };
    return this.prisma.business.update({ where: { id }, data, include: this.detailInclude });
  }

  async archive(id: string, userId: string): Promise<void> {
    await this.findOwned(id, userId);
    await this.prisma.business.update({ where: { id }, data: { deletedAt: new Date(), status: "BLOCKED" } });
  }

  async addService(id: string, userId: string, input: CreateServiceDto) {
    await this.findOwned(id, userId);
    return this.prisma.service.create({ data: { businessId: id, name: input.name.trim(), description: input.description?.trim(), priceRange: input.priceRange } });
  }

  async recordContact(id: string, userId: string, type: "PHONE" | "EMAIL" | "MESSAGE" | "LOCATION") {
    await this.findPublic(id);
    return this.prisma.contactEvent.create({ data: { businessId: id, userId, type } });
  }

  async recordView(id: string, userId: string) {
    await this.findPublic(id);
    return this.prisma.businessView.create({ data: { businessId: id, userId, source: "web" } });
  }

  async follow(id: string, userId: string) {
    await this.findPublic(id);
    const existing = await this.prisma.businessFollower.findUnique({ where: { userId_businessId: { userId, businessId: id } } });
    if (existing) return existing;
    const follower = await this.prisma.businessFollower.create({ data: { userId, businessId: id } });
    await this.rewards.award(userId, RewardEventType.BUSINESS_FOLLOWED, id);
    return follower;
  }

  async unfollow(id: string, userId: string): Promise<void> {
    const result = await this.prisma.businessFollower.deleteMany({ where: { userId, businessId: id } });
    if (!result.count) throw new NotFoundException("BUSINESS_FOLLOW_NOT_FOUND");
  }

  async listFollowing(userId: string) {
    return this.prisma.businessFollower.findMany({
      where: { userId, business: { deletedAt: null, status: "VERIFIED" } },
      include: { business: { include: { category: true, locations: { where: { deletedAt: null }, include: { city: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  }

  private async nextSlug(name: string): Promise<string> {
    const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "business";
    for (let suffix = 0; suffix < 1000; suffix += 1) {
      const candidate = suffix ? `${base}-${suffix + 1}` : base;
      if (await this.prisma.business.count({ where: { slug: candidate } }) === 0) return candidate;
    }
    throw new ForbiddenException("BUSINESS_SLUG_UNAVAILABLE");
  }
}
