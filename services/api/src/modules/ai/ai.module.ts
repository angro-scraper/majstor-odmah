import { Module } from "@nestjs/common";
import { SearchModule } from "../search/search.module";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { IntentService } from "./intent.service";
import { AiModerationService } from "./moderation.service";
import { AiRecommendationsService } from "./recommendations.service";
import { AiAssistantService } from "./assistant.service";
import { BusinessAiService } from "./business-ai.service";

@Module({
  imports: [SearchModule],
  controllers: [AiController],
  providers: [AiService, IntentService, AiModerationService, AiRecommendationsService, AiAssistantService, BusinessAiService],
})
export class AiModule {}
