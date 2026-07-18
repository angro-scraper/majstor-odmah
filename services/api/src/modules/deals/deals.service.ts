import { Injectable } from "@nestjs/common";
import { CategoriesService } from "../categories/categories.service";
import { ListOffersDto, OffersService } from "../offers/offers.service";

/** Public consumer facade for offers. Keeps the external Deals contract stable while offers remain the business-owned source of truth. */
@Injectable()
export class DealsService {
  constructor(private readonly offers: OffersService, private readonly categoriesService: CategoriesService) {}

  list(input: ListOffersDto) { return this.offers.listActive(input); }
  find(id: string) { return this.offers.findPublic(id); }
  async categories() {
    const categories = await this.categoriesService.list({});
    return categories.filter((category) => category.type === "FOOD" || category.type === "RETAIL");
  }
}
