import { Controller, Get, Query } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CategoriesService, ListCategoriesDto } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  async list(@Query() query: ListCategoriesDto) { return ok(await this.categories.list(query)); }
}
