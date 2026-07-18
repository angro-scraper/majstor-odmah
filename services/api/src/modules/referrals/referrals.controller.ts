import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateReferralDto, ReferralsService } from "./referrals.service";

@Controller("referrals")
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private readonly referrals: ReferralsService) {}
  @Post("create") create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateReferralDto) { return this.referrals.create(user.id, input).then((data) => ok(data, "Referral link created")); }
  @Get("status") status(@CurrentUser() user: AuthenticatedUser) { return this.referrals.status(user.id).then((data) => ok(data)); }
}
