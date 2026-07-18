import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({ imports: [RewardsModule], controllers: [OffersController], providers: [OffersService], exports: [OffersService] })
export class OffersModule {}
