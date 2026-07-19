import { Controller, Get, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { SearchBusinessesDto, SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  async businesses(@Query() query: SearchBusinessesDto) { return ok(await this.search.businesses(query), "Search completed"); }

  @Get("regional")
  async regionalBusinesses(@Query() query: SearchBusinessesDto) {
    return ok(await this.search.businesses(query), "Regional search completed");
  }
}
