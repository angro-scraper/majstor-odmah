import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser, JwtAuthGuard, AuthenticatedUser } from "../../common/security";
import { AiAssistantService, AiChatDto } from "./assistant.service";
import { BusinessAiAnalysisDto, BusinessAiService } from "./business-ai.service";
import { AiRecommendationsService } from "./recommendations.service";
import { AiSearchDto, AiService } from "./ai.service";

@Controller()
export class AiController {
  constructor(
    private readonly ai: AiService,
    private readonly assistant: AiAssistantService,
    private readonly recommendations: AiRecommendationsService,
    private readonly businessAi: BusinessAiService,
  ) {}

  @Post("ai/search")
  async search(@Body() input: AiSearchDto) {
    return ok(await this.ai.search(input), "AI search completed");
  }

  @Post("search/ai")
  async smartSearch(@Body() input: AiSearchDto) {
    return ok(await this.ai.search(input), "Smart search completed");
  }

  @UseGuards(JwtAuthGuard)
  @Post("ai/chat")
  async chat(@CurrentUser() user: AuthenticatedUser, @Body() input: AiChatDto) {
    return ok(await this.assistant.chat(user.id, input), "AI assistant response created");
  }

  @UseGuards(JwtAuthGuard)
  @Get("ai/recommendations")
  async personalizedRecommendations(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.recommendations.forUser(user.id), "AI recommendations created");
  }

  @UseGuards(JwtAuthGuard)
  @Post("business/ai/analyze")
  async analyzeBusiness(@CurrentUser() user: AuthenticatedUser, @Body() input: BusinessAiAnalysisDto) {
    return ok(await this.businessAi.analyze(user.id, input), "Business AI analysis created");
  }
}
