import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ReviewStatus } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsEmail, IsLatitude, IsLongitude, IsObject, IsOptional, IsPhoneNumber, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

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
  @IsOptional() @IsObject() openingHours?: Record<string, unknown>;
}

export class UpdateBusinessDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) name?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsPhoneNumber() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsObject() openingHours?: Record<string, unknown>;
}

export class CreateServiceDto {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() @MaxLength(100) priceRange?: string;
}

@Injectable()
export class BusinessesService {
  private readonly detailInclude = {
    category: true,
    locations: { include: { city: true }, where: { deletedAt: null } },
    services: { where: { deletedAt: null }, orderBy: { name: "asc" as const } },
    images: { where: { deletedAt: null }, orderBy: { orderIndex: "asc" as const } },
    reviews: { where: { status: ReviewStatus.APPROVED, deletedAt: null }, orderBy: { createdAt: "desc" as const }, take: 10 },
    _count: { select: { reviews: true, favorites: true } },
  } satisfies Prisma.BusinessInclude;

  constructor(private readonly prisma: PrismaService) {}

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

  async findOwned(id: string, userId: string) {
    const business = await this.prisma.business.findFirst({ where: { id, ownerId: userId, deletedAt: null }, include: this.detailInclude });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    return business;
  }

  async update(id: string, userId: string, input: UpdateBusinessDto) {
    await this.findOwned(id, userId);
    const { categoryId, openingHours, ...fields } = input;
    const data: Prisma.BusinessUpdateInput = { ...fields };
    if (openingHours !== undefined) data.openingHours = openingHours as unknown as Prisma.InputJsonValue;
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

  private async nextSlug(name: string): Promise<string> {
    const base = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "business";
    for (let suffix = 0; suffix < 1000; suffix += 1) {
      const candidate = suffix ? `${base}-${suffix + 1}` : base;
      if (await this.prisma.business.count({ where: { slug: candidate } }) === 0) return candidate;
    }
    throw new ForbiddenException("BUSINESS_SLUG_UNAVAILABLE");
  }
}
