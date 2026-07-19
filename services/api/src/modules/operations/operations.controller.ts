import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { OperationsService } from "./operations.service";

@Controller("operations")
@UseGuards(JwtAuthGuard)
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get("businesses/:id/onboarding")
  async businessOnboarding(@Param("id") businessId: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.operations.businessOnboarding(user.id, businessId));
  }

  @Get("daily-brief")
  @UseGuards(AdminGuard)
  async dailyBrief() { return ok(await this.operations.dailyBrief()); }

  @Get("cities/readiness")
  @UseGuards(AdminGuard)
  async cityReadiness() { return ok(await this.operations.cityReadiness()); }

  @Get("launch/plan")
  @UseGuards(AdminGuard)
  async launchPlan() { return ok(this.operations.launchPlan()); }

  @Get("launch/readiness")
  @UseGuards(AdminGuard)
  async launchReadiness() { return ok(await this.operations.launchReadiness()); }

  @Get("global-roadmap")
  @UseGuards(AdminGuard)
  async globalRoadmap() { return ok(this.operations.globalRoadmap()); }
}
