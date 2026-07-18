import { Injectable } from "@nestjs/common";
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { SearchService } from "../search/search.service";

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

type AiIntent = {
  type: "business_discovery";
  needs: string[];
  urgency: "normal" | "urgent";
  confidence: "low" | "medium" | "high";
};

@Injectable()
export class AiService {
  constructor(private readonly searchService: SearchService) {}

  async search(input: AiSearchDto) {
    const query = input.query.trim().replace(/\s+/g, " ");
    const intent = this.recognizeIntent(query);
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

  private recognizeIntent(query: string): AiIntent {
    const normalized = query.toLocaleLowerCase("sr-Latn-RS");
    const signals = [
      { name: "auto", words: ["auto", "servis", "mehanič", "gume", "vulkanizer"] },
      { name: "hrana", words: ["restoran", "ručak", "večera", "hrana", "kafić"] },
      { name: "lepota", words: ["frizer", "salon", "kozmet", "brijač"] },
      { name: "zdravlje", words: ["zubar", "doktor", "ordinacija", "stomatolog"] },
      { name: "dom", words: ["majstor", "električ", "vodoinstal", "klima"] },
    ];
    const needs = signals.filter(({ words }) => words.some((word) => normalized.includes(word))).map(({ name }) => name);
    const urgent = ["hitno", "odmah", "danas", "večeras"].some((word) => normalized.includes(word));

    return {
      type: "business_discovery",
      needs: needs.length ? needs : ["lokalna usluga"],
      urgency: urgent ? "urgent" : "normal",
      confidence: needs.length ? "high" : query.split(" ").length > 2 ? "medium" : "low",
    };
  }
}
