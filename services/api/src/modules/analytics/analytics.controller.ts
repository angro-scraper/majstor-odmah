import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { AnalyticsService, TrackEventDto } from "./analytics.service";

@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post("events")
  async track(@CurrentUser() user: AuthenticatedUser, @Body() input: TrackEventDto) {
    return ok(await this.analytics.track(user.id, input), "Event tracked");
  }

  @Get("businesses/:id")
  async businessMetrics(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.analytics.businessMetrics(user.id, businessId));
  }

  @Get("businesses/:id/insights")
  async businessInsights(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.analytics.businessInsights(user.id, businessId));
  }
}
