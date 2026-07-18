import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { ReferralsController } from "./referrals.controller";
import { ReferralsService } from "./referrals.service";

@Module({ imports: [RewardsModule], controllers: [ReferralsController], providers: [ReferralsService], exports: [ReferralsService] })
export class ReferralsModule {}
