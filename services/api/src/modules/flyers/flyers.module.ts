import { Module } from "@nestjs/common";
import { FeaturesModule } from "../features/features.module";
import { FlyersController } from "./flyers.controller";
import { FlyersService } from "./flyers.service";

@Module({ imports: [FeaturesModule], controllers: [FlyersController], providers: [FlyersService] })
export class FlyersModule {}
