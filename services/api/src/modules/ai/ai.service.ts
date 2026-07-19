import { Injectable } from "@nestjs/common";
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { SearchService } from "../search/search.service";
import { IntentService } from "./intent.service";

export class AiSearchDto {
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  query!: string;

  @IsOptional()
  @IsUUID()
  cityId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

@Injectable()
export class AiService {
  constructor(private readonly searchService: SearchService, private readonly intentService: IntentService) {}

  async search(input: AiSearchDto) {
    const query = input.query.trim().replace(/\s+/g, " ");
    const intent = this.intentService.recognize(query);
    const results = await this.searchService.businesses({
      query,
      cityId: input.cityId,
      categoryId: input.categoryId,
    });

    return {
      query,
      intent,
      results,
      explanation: results.length
        ? "Rezultati su zasnovani na podudaranju zahteva sa odobrenim firmama, uslugama i lokacijom."
        : "Nema dovoljno podudaranja. Pokušaj da navedeš grad ili drugačiji naziv usluge.",
    };
  }

}
