import { Module } from "@nestjs/common";
import { FeaturesModule } from "../features/features.module";
import { SaveFoodController } from "./save-food.controller";
import { SaveFoodService } from "./save-food.service";

@Module({ imports: [FeaturesModule], controllers: [SaveFoodController], providers: [SaveFoodService] })
export class SaveFoodModule {}
