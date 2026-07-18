import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

const subjects = ["GENERAL", "SUPPORT", "BUSINESS", "REPORT", "MEDIA"] as const;
export class CreateContactInquiryDto {
  @IsString() @MaxLength(120) name!: string;
  @IsEmail() @MaxLength(254) email!: string;
  @IsIn(subjects) subject!: (typeof subjects)[number];
  @IsString() @MaxLength(5000) message!: string;
  @IsOptional() @IsString() website?: string;
}

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createInquiry(input: CreateContactInquiryDto) {
    if (input.website) return { received: true };
    const recent = await this.prisma.contactInquiry.count({ where: { email: input.email.toLowerCase(), createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } } });
    if (recent >= 5) throw new HttpException("CONTACT_RATE_LIMITED", HttpStatus.TOO_MANY_REQUESTS);
    const inquiry = await this.prisma.contactInquiry.create({ data: { name: input.name.trim(), email: input.email.trim().toLowerCase(), subject: input.subject, message: input.message.trim() } });
    await this.prisma.auditLog.create({ data: { action: "CONTACT_INQUIRY_CREATED", resourceType: "contact_inquiry", resourceId: inquiry.id, payload: { subject: inquiry.subject } } });
    return { received: true };
  }
}
