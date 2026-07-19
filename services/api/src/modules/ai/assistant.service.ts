import { Injectable } from "@nestjs/common";
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { AiModerationService } from "./moderation.service";
import { IntentService } from "./intent.service";
import { AiRecommendationsService } from "./recommendations.service";

export class AiChatDto {
  @IsString() @MinLength(2) @MaxLength(500) message!: string;
  @IsOptional() @IsUUID() cityId?: string;
}

@Injectable()
export class AiAssistantService {
  constructor(
    private readonly moderation: AiModerationService,
    private readonly intent: IntentService,
    private readonly recommendations: AiRecommendationsService,
  ) {}

  async chat(userId: string, input: AiChatDto) {
    const message = input.message.trim().replace(/\s+/g, " ");
    await this.moderation.assertSafe(userId, message, "chat");
    const intent = this.intent.recognize(message);
    const recommendations = await this.recommendations.discover({ query: this.intent.searchTerms(message, intent), cityId: input.cityId, surface: "AI_CHAT" }, intent, userId);
    await this.moderation.audit(userId, "AI_CHAT_COMPLETED", "chat", { resultCount: recommendations.length, intent: intent.needs });
    return {
      answer: recommendations.length
        ? `Pronašao sam ${recommendations.length} relevantnih opcija. Preporuke su zasnovane na javno dostupnim profilima, aktivnim ponudama i vašoj lokaciji kada je postavljena.`
        : "Trenutno nemam dovoljno podudaranja. Probaj da dodaš grad, tip usluge ili vreme kada ti je potrebno.",
      intent,
      recommendations,
      safety: { autonomousActions: false, financialActions: false, source: "public_platform_data" },
    };
  }
}
