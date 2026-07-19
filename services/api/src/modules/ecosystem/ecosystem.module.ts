import { Module } from "@nestjs/common";
import { FeaturesModule } from "../features/features.module";
import { EcosystemController } from "./ecosystem.controller";
import { EcosystemService } from "./ecosystem.service";

@Module({ imports: [FeaturesModule], controllers: [EcosystemController], providers: [EcosystemService] })
export class EcosystemModule {}
