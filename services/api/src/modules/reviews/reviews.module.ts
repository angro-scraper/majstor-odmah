import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({ imports: [RewardsModule], controllers: [ReviewsController], providers: [ReviewsService], exports: [ReviewsService] })
export class ReviewsModule {}
