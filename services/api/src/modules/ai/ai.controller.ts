import { Body, Controller, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AiSearchDto, AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("search")
  async search(@Body() input: AiSearchDto) {
    return ok(await this.ai.search(input), "AI search completed");
  }
}
