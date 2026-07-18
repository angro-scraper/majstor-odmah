import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { BusinessesController } from "./businesses.controller";
import { BusinessesService } from "./businesses.service";

@Module({ imports: [RewardsModule], controllers: [BusinessesController], providers: [BusinessesService], exports: [BusinessesService] })
export class BusinessesModule {}
