import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { AdminScopeLevel } from "@prisma/client";
import { IsEnum, IsOptional, IsUUID } from "class-validator";

export class ModerationStatusDto {
  @IsEnum(["VERIFIED", "BLOCKED"] as const) status!: "VERIFIED" | "BLOCKED";
}

export class ReviewModerationDto {
  @IsEnum(["APPROVED", "REJECTED"] as const) status!: "APPROVED" | "REJECTED";
}

export class AssignAdminScopeDto {
  @IsUUID() userId!: string;
  @IsEnum(AdminScopeLevel) level!: AdminScopeLevel;
  @IsOptional() @IsUUID() countryId?: string;
  @IsOptional() @IsUUID() cityId?: string;
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

  /** A non-sensitive operational view for the protected Admin Security Center. */
  async securityOverview() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [failedLogins, successfulLogins, financialRiskFlags, blockedUsers, activeSessions, openDataRequests] = await Promise.all([
      this.prisma.auditLog.count({ where: { action: "AUTH_LOGIN_FAILED", createdAt: { gte: since } } }),
      this.prisma.auditLog.count({ where: { action: "AUTH_LOGIN_SUCCEEDED", createdAt: { gte: since } } }),
      this.prisma.auditLog.count({ where: { action: "FINANCIAL_RISK_FLAGGED", createdAt: { gte: since } } }),
      this.prisma.user.count({ where: { status: "BLOCKED", deletedAt: null } }),
      this.prisma.authSession.count({ where: { revokedAt: null, expiresAt: { gt: new Date() } } }),
      this.prisma.dataSubjectRequest.count({ where: { status: { in: ["PENDING", "IN_REVIEW"] } } }),
    ]);
    return {
      periodHours: 24,
      authentication: { failedLogins, successfulLogins, activeSessions },
      risk: { financialRiskFlags, blockedUsers },
      compliance: { openDataRequests },
      escalation: { runbook: "docs/global-operations-security.md#incident-response", severity: failedLogins > 50 || financialRiskFlags > 0 ? "REVIEW" : "NORMAL" },
    };
  }

  async securityEvents(limit = 50) {
    const actions = ["AUTH_LOGIN_FAILED", "AUTH_LOGIN_SUCCEEDED", "AUTH_TOKEN_REFRESHED", "FINANCIAL_RISK_FLAGGED", "DATA_EXPORT_GENERATED", "ADMIN_SCOPE_ASSIGNED"];
    return this.prisma.auditLog.findMany({
      where: { action: { in: actions } },
      select: { id: true, action: true, resourceType: true, resourceId: true, createdAt: true, actor: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" }, take: Math.min(Math.max(limit, 1), 100),
    });
  }

  async regionalOverview() {
    const countries = await this.prisma.country.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        code: true,
        name: true,
        currency: true,
        isActive: true,
        _count: { select: { cities: { where: { deletedAt: null } } } },
      },
      orderBy: { name: "asc" },
    });

    const businessLocations = await this.prisma.businessLocation.findMany({
      where: { deletedAt: null, city: { country: { deletedAt: null } } },
      select: { city: { select: { countryId: true } } },
    });
    const businessCountByCountry = businessLocations.reduce<Record<string, number>>((counts, location) => {
      counts[location.city.countryId] = (counts[location.city.countryId] ?? 0) + 1;
      return counts;
    }, {});

    return countries.map((country) => ({
      ...country,
      cities: country._count.cities,
      businesses: businessCountByCountry[country.id] ?? 0,
      _count: undefined,
    }));
  }

  async listAdminScopes(userId?: string) {
    return this.prisma.adminScope.findMany({
      where: userId ? { userId } : {},
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        country: { select: { id: true, code: true, name: true } },
        city: { select: { id: true, name: true, country: { select: { code: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async assignAdminScope(input: AssignAdminScopeDto, actorUserId: string) {
    await this.assertSuperAdmin(actorUserId);
    if (input.level === AdminScopeLevel.COUNTRY && !input.countryId) {
      throw new NotFoundException("COUNTRY_SCOPE_REQUIRES_COUNTRY");
    }
    if (input.level === AdminScopeLevel.CITY && !input.cityId) {
      throw new NotFoundException("CITY_SCOPE_REQUIRES_CITY");
    }
    if (input.countryId) {
      const country = await this.prisma.country.findFirst({ where: { id: input.countryId, deletedAt: null, isActive: true } });
      if (!country) throw new NotFoundException("COUNTRY_NOT_FOUND");
    }
    if (input.cityId) {
      const city = await this.prisma.city.findFirst({ where: { id: input.cityId, deletedAt: null } });
      if (!city) throw new NotFoundException("CITY_NOT_FOUND");
      if (input.countryId && city.countryId !== input.countryId) throw new NotFoundException("CITY_COUNTRY_MISMATCH");
    }

    const scope = await this.prisma.adminScope.create({
      data: {
        userId: input.userId,
        level: input.level,
        countryId: input.countryId,
        cityId: input.cityId,
        assignedById: actorUserId,
      },
    });
    await this.prisma.auditLog.create({ data: { actorUserId, action: "ADMIN_SCOPE_ASSIGNED", resourceType: "admin_scope", resourceId: scope.id } });
    return scope;
  }

  private async assertSuperAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { roles: { include: { role: true } } } });
    if (!user?.roles.some(({ role }) => role.name === "SUPER_ADMIN")) throw new ForbiddenException("SUPER_ADMIN_PERMISSION_REQUIRED");
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
