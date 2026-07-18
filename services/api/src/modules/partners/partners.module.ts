import { Module } from "@nestjs/common";
import { PartnersController, PartnerApiController } from "./partners.controller";
import { PartnerApiKeyGuard } from "./partner-api-key.guard";
import { PartnersService } from "./partners.service";

@Module({
  controllers: [PartnersController, PartnerApiController],
  providers: [PartnersService, PartnerApiKeyGuard],
})
export class PartnersModule {}
