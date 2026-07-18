import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { PartnerApiKeyGuard, PartnerApiPrincipal } from "./partner-api-key.guard";
import { CreateIntegrationDto, CreatePartnerDto, CreatePartnerKeyDto, UpdatePartnerDto } from "./partners.dto";
import { PartnersService } from "./partners.service";

@Controller("partners")
export class PartnersController {
  constructor(private readonly partners: PartnersService) {}

  @Get(":slug")
  async publicProfile(@Param("slug") slug: string) { return ok(await this.partners.publicProfile(slug)); }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async list() { return ok(await this.partners.list()); }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreatePartnerDto) { return ok(await this.partners.create(user.id, input), "Partner created"); }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: UpdatePartnerDto) { return ok(await this.partners.update(user.id, id, input)); }

  @Post(":id/api-keys")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createApiKey(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: CreatePartnerKeyDto) { return ok(await this.partners.createApiKey(user.id, id, input), "Partner API key created"); }

  @Post(":id/integrations")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createIntegration(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: CreateIntegrationDto) { return ok(await this.partners.createIntegration(user.id, id, input), "Partner integration created"); }
}

@Controller("partner/v1")
@UseGuards(PartnerApiKeyGuard)
export class PartnerApiController {
  constructor(private readonly partners: PartnersService) {}

  @Get("me")
  async me(@Req() request: { partner?: PartnerApiPrincipal }) {
    return ok(await this.partners.dashboard(request.partner!.partnerId));
  }
}
