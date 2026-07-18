import { Controller, Get } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { FeaturesService } from "./features.service";

@Controller("features")
export class FeaturesController {
  constructor(private readonly features: FeaturesService) {}

  @Get()
  list() { return ok(this.features.publicFlags()); }
}
