import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateReviewDto, ReviewsService } from "./reviews.service";

@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Post("reviews") @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateReviewDto) { return ok(await this.reviews.create(user.id, input), "Review submitted for moderation"); }

  @Get("businesses/:id/reviews")
  async list(@Param("id") id: string) { return ok(await this.reviews.listForBusiness(id)); }
}
