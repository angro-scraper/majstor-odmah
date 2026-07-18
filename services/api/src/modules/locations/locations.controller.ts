import { Controller, Get, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { LocationsService } from "./locations.service";

@Controller("locations")
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Get("countries")
  async countries() { return ok(await this.locations.countries()); }

  @Get("cities")
  async cities(@Query("countryId") countryId?: string, @Query("query") query?: string) {
    return ok(await this.locations.cities(countryId, query));
  }
}
