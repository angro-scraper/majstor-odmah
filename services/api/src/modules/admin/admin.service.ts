import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { IsEnum } from "class-validator";

export class ModerationStatusDto {
  @IsEnum(["VERIFIED", "BLOCKED"] as const) status!: "VERIFIED" | "BLOCKED";
}

export class ReviewModerationDto {
  @IsEnum(["APPROVED", "REJECTED"] as const) status!: "APPROVED" | "REJECTED";
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [users, businesses, pendingBusinesses, pendingReviews] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.business.count({ where: { deletedAt: null } }),
      this.prisma.business.count({ where: { deletedAt: null, status: "PENDING" } }),
      this.prisma.review.count({ where: { deletedAt: null, status: "PENDING" } }),
    ]);
    return { users, businesses, pendingBusinesses, pendingReviews };
  }

  async listUsers(limit: number) {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, email: true, phone: true, status: true, createdAt: true, profile: { select: { firstName: true, lastName: true } }, roles: { select: { role: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 100),
    });
  }

  async listBusinesses(status?: string, limit = 30) {
    return this.prisma.business.findMany({
      where: { deletedAt: null, ...(status ? { status: status as "DRAFT" | "PENDING" | "VERIFIED" | "BLOCKED" } : {}) },
      include: { owner: { include: { profile: true } }, category: true, locations: { include: { city: true }, where: { deletedAt: null } } },
      orderBy: { createdAt: "desc" },
      take: Math.min(Math.max(limit, 1), 100),
    });
  }

  async listPendingReviews(limit: number) {
    return this.prisma.review.findMany({
      where: { deletedAt: null, status: "PENDING" },
      include: { user: { include: { profile: true } }, business: true },
      orderBy: { createdAt: "asc" },
      take: Math.min(Math.max(limit, 1), 100),
    });
  }

  async moderateBusiness(id: string, status: ModerationStatusDto["status"], actorUserId: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business || business.deletedAt) throw new NotFoundException("BUSINESS_NOT_FOUND");
    const updated = await this.prisma.business.update({ where: { id }, data: { status, verificationStatus: status === "VERIFIED" ? "VERIFIED" : "REJECTED" } });
    await this.prisma.auditLog.create({ data: { actorUserId, action: `BUSINESS_${status}`, resourceType: "business", resourceId: id } });
    return updated;
  }

  async moderateReview(id: string, status: ReviewModerationDto["status"], actorUserId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review || review.deletedAt) throw new NotFoundException("REVIEW_NOT_FOUND");
    const updated = await this.prisma.review.update({ where: { id }, data: { status } });
    await this.prisma.auditLog.create({ data: { actorUserId, action: `REVIEW_${status}`, resourceType: "review", resourceId: id } });
    return updated;
  }
}
