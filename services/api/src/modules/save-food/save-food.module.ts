import { Module } from "@nestjs/common";
import { FeaturesModule } from "../features/features.module";
import { RewardsModule } from "../rewards/rewards.module";
import { SaveFoodController } from "./save-food.controller";
import { SaveFoodService } from "./save-food.service";

@Module({ imports: [FeaturesModule, RewardsModule], controllers: [SaveFoodController], providers: [SaveFoodService] })
export class SaveFoodModule {}
