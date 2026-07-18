import { Module } from "@nestjs/common";
import { PartnersController, PartnerApiController } from "./partners.controller";
import { PartnerApiKeyGuard } from "./partner-api-key.guard";
import { PartnersService } from "./partners.service";
import { FeaturesModule } from "../features/features.module";

@Module({
  imports: [FeaturesModule],
  controllers: [PartnersController, PartnerApiController],
  providers: [PartnersService, PartnerApiKeyGuard],
  exports: [PartnersService],
})
export class PartnersModule {}
