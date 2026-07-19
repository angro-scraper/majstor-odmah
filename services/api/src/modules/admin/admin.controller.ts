import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { AdminService, AssignAdminScopeDto, ModerationStatusDto, ReviewModerationDto } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("overview") async overview() { return ok(await this.admin.overview()); }
  @Get("regional/overview") async regionalOverview() { return ok(await this.admin.regionalOverview()); }
  @Get("regional/scopes") async regionalScopes(@Query("userId") userId?: string) { return ok(await this.admin.listAdminScopes(userId)); }
  @Post("regional/scopes") async assignRegionalScope(@Body() input: AssignAdminScopeDto, @CurrentUser() user: AuthenticatedUser) { return ok(await this.admin.assignAdminScope(input, user.id)); }
  @Get("users") async users(@Query("limit") limit?: string) { return ok(await this.admin.listUsers(Number(limit) || 30)); }
  @Get("businesses") async businesses(@Query("status") status?: string, @Query("limit") limit?: string) { return ok(await this.admin.listBusinesses(status, Number(limit) || 30)); }
  @Get("reviews/pending") async pendingReviews(@Query("limit") limit?: string) { return ok(await this.admin.listPendingReviews(Number(limit) || 30)); }
  @Patch("businesses/:id/status") async moderateBusiness(@Param("id") id: string, @Body() input: ModerationStatusDto, @CurrentUser() user: AuthenticatedUser) { return ok(await this.admin.moderateBusiness(id, input.status, user.id)); }
  @Patch("reviews/:id/status") async moderateReview(@Param("id") id: string, @Body() input: ReviewModerationDto, @CurrentUser() user: AuthenticatedUser) { return ok(await this.admin.moderateReview(id, input.status, user.id)); }
}
