import { IsArray, IsDateString, IsEmail, IsEnum, IsObject, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { PartnerCategory, PartnerIntegrationStatus, PartnerLevel, PartnerStatus } from "@prisma/client";

export class CreatePartnerDto {
  @IsString() @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(120) slug?: string;
  @IsEnum(PartnerCategory) category!: PartnerCategory;
  @IsOptional() @IsEnum(PartnerLevel) level?: PartnerLevel;
  @IsOptional() @IsEnum(PartnerStatus) status?: PartnerStatus;
  @IsOptional() @IsString() @MaxLength(120) contactName?: string;
  @IsOptional() @IsEmail() contactEmail?: string;
  @IsOptional() @IsString() @Matches(/^https:\/\//i) @MaxLength(2048) website?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
}

export class UpdatePartnerDto {
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(120) slug?: string;
  @IsOptional() @IsEnum(PartnerCategory) category?: PartnerCategory;
  @IsOptional() @IsEnum(PartnerLevel) level?: PartnerLevel;
  @IsOptional() @IsEnum(PartnerStatus) status?: PartnerStatus;
  @IsOptional() @IsString() @MaxLength(120) contactName?: string;
  @IsOptional() @IsEmail() contactEmail?: string;
  @IsOptional() @IsString() @Matches(/^https:\/\//i) @MaxLength(2048) website?: string;
  @IsOptional() @IsString() @MaxLength(4000) description?: string;
}

export class CreatePartnerKeyDto {
  @IsString() @MaxLength(120) label!: string;
  @IsOptional() @IsArray() @IsString({ each: true }) scopes?: string[];
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class CreateIntegrationDto {
  @IsString() @MaxLength(120) name!: string;
  @IsString() @MaxLength(80) integrationType!: string;
  @IsOptional() @IsEnum(PartnerIntegrationStatus) status?: PartnerIntegrationStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) scopes?: string[];
  @IsOptional() @IsObject() configuration?: Record<string, unknown>;
  @IsOptional() @IsDateString() startedAt?: string;
}
