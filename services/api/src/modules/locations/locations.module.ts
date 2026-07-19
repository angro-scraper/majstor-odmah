import { Module } from "@nestjs/common";
import { LocationsController, RegionalCatalogController } from "./locations.controller";
import { LocationsService } from "./locations.service";

@Module({ controllers: [LocationsController, RegionalCatalogController], providers: [LocationsService] })
export class LocationsModule {}
