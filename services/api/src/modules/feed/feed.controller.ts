import { Controller, Get, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { FeedService } from "./feed.service";

@Controller("feed")
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feed: FeedService) {}
  @Get() list(@CurrentUser() user: AuthenticatedUser) { return this.feed.personalized(user.id).then((data) => ok(data)); }
}
