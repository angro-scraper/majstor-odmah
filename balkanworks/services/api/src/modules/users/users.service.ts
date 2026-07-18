import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(100) lastName?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsUUID() countryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
  @IsOptional() @IsObject() preferences?: Record<string, unknown>;
  @IsOptional() @IsObject() interests?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(10) language?: string;
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
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...input },
      update: input,
      include: { country: true, city: true },
    });
  }
}
