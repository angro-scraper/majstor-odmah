import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class CreateReviewDto {
  @IsUUID() businessId!: string;
  @IsInt() @Min(1) @Max(5) rating!: number;
  @IsOptional() @IsString() @MaxLength(2000) comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateReviewDto) {
    const [business, contact] = await Promise.all([
      this.prisma.business.findFirst({ where: { id: input.businessId, deletedAt: null, status: "VERIFIED" } }),
      this.prisma.contactEvent.findFirst({ where: { userId, businessId: input.businessId } }),
    ]);
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    if (!contact) throw new ForbiddenException("REVIEW_REQUIRES_BUSINESS_INTERACTION");
    return this.prisma.review.upsert({
      where: { userId_businessId: { userId, businessId: input.businessId } },
      create: { userId, businessId: input.businessId, rating: input.rating, comment: input.comment?.trim() },
      update: { rating: input.rating, comment: input.comment?.trim(), status: "PENDING", deletedAt: null },
    });
  }

  async listForBusiness(businessId: string) {
    return this.prisma.review.findMany({ where: { businessId, status: "APPROVED", deletedAt: null }, include: { user: { include: { profile: true } } }, orderBy: { createdAt: "desc" } });
  }
}
