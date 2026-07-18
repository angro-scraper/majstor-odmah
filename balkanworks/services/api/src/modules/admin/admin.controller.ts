import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { AdminService, ModerationStatusDto, ReviewModerationDto } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("overview") async overview() { return ok(await this.admin.overview()); }
  @Patch("businesses/:id/status") async moderateBusiness(@Param("id") id: string, @Body() input: ModerationStatusDto, @CurrentUser() user: AuthenticatedUser) { return ok(await this.admin.moderateBusiness(id, input.status, user.id)); }
  @Patch("reviews/:id/status") async moderateReview(@Param("id") id: string, @Body() input: ReviewModerationDto, @CurrentUser() user: AuthenticatedUser) { return ok(await this.admin.moderateReview(id, input.status, user.id)); }
}
