import { Controller, Get, Param, Query } from "@nestjs/common";
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

  @Get("cities/:countryId")
  async citiesForCountry(@Param("countryId") countryId: string, @Query("query") query?: string) {
    return ok(await this.locations.cities(countryId, query));
  }
}

/** Public regional catalog endpoints used by web, mobile, and partner clients. */
@Controller()
export class RegionalCatalogController {
  constructor(private readonly locations: LocationsService) {}

  @Get("countries")
  async countries() { return ok(await this.locations.countries()); }

  @Get("currencies")
  async currencies() { return ok(await this.locations.currencies()); }

  @Get("languages")
  async languages() { return ok(this.locations.languages()); }

  @Get("translations")
  async translations(@Query("language") language = "sr", @Query("countryId") countryId?: string) {
    return ok(await this.locations.translations(language, countryId));
  }
}
