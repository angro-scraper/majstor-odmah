import { Module } from "@nestjs/common";
import { CategoriesModule } from "../categories/categories.module";
import { OffersModule } from "../offers/offers.module";
import { DealsController } from "./deals.controller";
import { DealsService } from "./deals.service";

@Module({ imports: [OffersModule, CategoriesModule], controllers: [DealsController], providers: [DealsService] })
export class DealsModule {}
