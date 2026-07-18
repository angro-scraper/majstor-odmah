import { Body, Controller, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CreateContactInquiryDto, SupportService } from "./support.service";

@Controller("support")
export class SupportController {
  constructor(private readonly support: SupportService) {}
  @Post("contact") async contact(@Body() input: CreateContactInquiryDto) { return ok(await this.support.createInquiry(input), "Poruka je uspešno poslata"); }
}
