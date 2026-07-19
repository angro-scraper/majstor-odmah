import { Injectable } from "@nestjs/common";
import { AiIntent } from "./ai.types";

const INTENT_SIGNALS = [
  { name: "auto", words: ["auto", "servis", "mehanič", "mehanic", "gume", "vulkanizer"] },
  { name: "hrana", words: ["restoran", "ručak", "rucak", "večera", "vecera", "hrana", "kafić", "kafic", "pekar", "pica", "pizza"] },
  { name: "lepota", words: ["frizer", "salon", "kozmet", "brijač", "brijac"] },
  { name: "zdravlje", words: ["zubar", "doktor", "ordinacija", "stomatolog"] },
  { name: "dom", words: ["majstor", "električ", "elektric", "vodoinstal", "klima", "čišćen", "ciscen"] },
] as const;

@Injectable()
export class IntentService {
  recognize(query: string): AiIntent {
    const normalized = query.toLocaleLowerCase("sr-Latn-RS");
    const needs = INTENT_SIGNALS.filter(({ words }) => words.some((word) => normalized.includes(word))).map(({ name }) => name);
    const urgent = ["hitno", "odmah", "danas", "večeras", "veceras", "sada"].some((word) => normalized.includes(word));
    const value = ["jeftin", "povolj", "popust", "akcij"].some((word) => normalized.includes(word));

    return {
      type: "business_discovery",
      needs: needs.length ? [...needs] : ["lokalna usluga"],
      urgency: urgent ? "urgent" : "normal",
      budget: value ? "value" : "standard",
      confidence: needs.length ? "high" : query.split(" ").length > 2 ? "medium" : "low",
    };
  }

  searchTerms(query: string, intent: AiIntent): string {
    return intent.needs[0] === "lokalna usluga" ? query : intent.needs.join(" ");
  }
}
