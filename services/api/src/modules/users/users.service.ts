import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsDateString, IsLatitude, IsLongitude, IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsUUID() countryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() interests?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(10) language?: string;
}

export class UpdateUserLocationDto {
  @IsUUID() cityId!: string;
  @IsOptional() @IsLatitude() latitude?: number;
  @IsOptional() @IsLongitude() longitude?: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { country: true, city: true } }, roles: { include: { role: true } } },
    });
    if (!user) throw new NotFoundException("USER_NOT_FOUND");
    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    await this.getProfile(userId);
    const { preferences, interests, dateOfBirth, ...fields } = input;
    const jsonFields = {
      ...(preferences !== undefined ? { preferences: preferences as unknown as Prisma.InputJsonValue } : {}),
      ...(interests !== undefined ? { interests: interests as unknown as Prisma.InputJsonValue } : {}),
    };
    const createData: Prisma.ProfileUncheckedCreateInput = {
      userId,
      ...fields,
      ...(dateOfBirth !== undefined ? { dateOfBirth: new Date(dateOfBirth) } : {}),
      ...jsonFields,
    };
    const updateData: Prisma.ProfileUncheckedUpdateInput = {
      ...fields,
      ...(dateOfBirth !== undefined ? { dateOfBirth: new Date(dateOfBirth) } : {}),
      ...jsonFields,
    };
    return this.prisma.profile.upsert({
      where: { userId },
      create: createData,
      update: updateData,
      include: { country: true, city: true },
    });
  }

  async getPrimaryLocation(userId: string) {
    return this.prisma.userLocation.findFirst({
      where: { userId, isPrimary: true },
      include: { city: { include: { country: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async updatePrimaryLocation(userId: string, input: UpdateUserLocationDto) {
    await this.getProfile(userId);
    const city = await this.prisma.city.findFirst({ where: { id: input.cityId, deletedAt: null }, select: { id: true, countryId: true } });
    if (!city) throw new NotFoundException("CITY_NOT_FOUND");

    return this.prisma.$transaction(async (transaction) => {
      await transaction.userLocation.updateMany({ where: { userId }, data: { isPrimary: false } });
      const location = await transaction.userLocation.upsert({
        where: { userId_cityId: { userId, cityId: city.id } },
        create: { userId, cityId: city.id, latitude: input.latitude, longitude: input.longitude, isPrimary: true },
        update: { latitude: input.latitude, longitude: input.longitude, isPrimary: true },
        include: { city: { include: { country: true } } },
      });
      await transaction.profile.upsert({
        where: { userId },
        create: { userId, cityId: city.id, countryId: city.countryId },
        update: { cityId: city.id, countryId: city.countryId },
      });
      return location;
    });
  }
}
