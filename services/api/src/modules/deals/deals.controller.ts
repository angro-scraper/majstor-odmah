import { Controller, Get, Param, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { ListOffersDto } from "../offers/offers.service";
import { DealsService } from "./deals.service";

@Controller("deals")
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  async list(@Query() query: ListOffersDto) { return ok(await this.deals.list(query)); }

  @Get("categories")
  async categories() { return ok(await this.deals.categories()); }

  @Get(":id")
  async get(@Param("id") id: string) { return ok(await this.deals.find(id)); }
}
