import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { AnalyticsService, TrackEventDto } from "./analytics.service";

@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post("events")
  async track(@CurrentUser() user: AuthenticatedUser, @Body() input: TrackEventDto) {
    return ok(await this.analytics.track(user.id, input), "Event tracked");
  }

  @Get("me/summary")
  async userSummary(@CurrentUser() user: AuthenticatedUser) { return ok(await this.analytics.userSummary(user.id)); }

  @Get("me/intelligence")
  async userIntelligence(@CurrentUser() user: AuthenticatedUser) { return ok(await this.analytics.userIntelligence(user.id)); }

  @Get("platform/summary")
  @UseGuards(AdminGuard)
  async platformSummary() { return ok(await this.analytics.platformSummary()); }

  @Get("platform/regional")
  @UseGuards(AdminGuard)
  async regionalSummary(@Query("country") countryCode?: string) { return ok(await this.analytics.regionalSummary(countryCode)); }

  @Get("businesses/:id")
  async businessMetrics(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.analytics.businessMetrics(user.id, businessId));
  }

  @Get("businesses/:id/insights")
  async businessInsights(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.analytics.businessInsights(user.id, businessId));
  }

  @Get("businesses/:id/report")
  async businessReport(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.analytics.businessReport(user.id, businessId));
  }
}
