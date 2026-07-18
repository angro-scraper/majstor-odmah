import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { RewardsService } from "./rewards.service";

@Controller("rewards")
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewards: RewardsService) {}
  @Get("balance") balance(@CurrentUser() user: AuthenticatedUser) { return this.rewards.balance(user.id).then((data) => ok(data)); }
  @Get("history") history(@CurrentUser() user: AuthenticatedUser) { return this.rewards.history(user.id).then((data) => ok(data)); }
  @Get("catalog") catalog() { return this.rewards.catalog().then((data) => ok(data)); }
  @Get("challenges") challenges(@CurrentUser() user: AuthenticatedUser) { return this.rewards.challenges(user.id).then((data) => ok(data)); }
  @Post("check-in") checkIn(@CurrentUser() user: AuthenticatedUser) { return this.rewards.checkIn(user.id).then((data) => ok(data, data.awarded ? "Daily reward added" : "Already checked in today")); }
}
