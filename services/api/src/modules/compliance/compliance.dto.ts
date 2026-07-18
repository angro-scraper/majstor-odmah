import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { DataSubjectRequestStatus, DataSubjectRequestType, LegalDocumentType } from "@prisma/client";

export class AcceptConsentDto {
  @IsUUID() documentId!: string;
  @IsOptional() @IsString() @MaxLength(120) source?: string;
}

export class CreateDataRequestDto {
  @IsEnum(DataSubjectRequestType) type!: DataSubjectRequestType;
  @IsOptional() @IsString() @MaxLength(2000) note?: string;
}

export class CreateLegalDocumentDto {
  @IsEnum(LegalDocumentType) type!: LegalDocumentType;
  @IsString() @MaxLength(30) version!: string;
  @IsOptional() @IsString() @MaxLength(10) locale?: string;
  @IsString() @MaxLength(200) title!: string;
  @IsString() @MaxLength(50000) content!: string;
}

export class ResolveDataRequestDto {
  @IsEnum(DataSubjectRequestStatus) status!: DataSubjectRequestStatus;
  @IsOptional() @IsString() @MaxLength(2000) note?: string;
  @IsOptional() @IsDateString() completedAt?: string;
}
