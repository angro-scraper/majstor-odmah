import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { PartnerApiKeyGuard, PartnerApiPrincipal, PartnerScopes } from "./partner-api-key.guard";
import { CreateIntegrationDto, CreatePartnerDto, CreatePartnerKeyDto, CreateWebhookDto, UpdatePartnerDto, UpdateWebhookDto } from "./partners.dto";
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

  @Post(":id/api-keys/:keyId/revoke")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async revokeApiKey(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Param("keyId") keyId: string) { return ok(await this.partners.revokeApiKey(user.id, id, keyId), "Partner API key revoked"); }

  @Post(":id/integrations")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createIntegration(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: CreateIntegrationDto) { return ok(await this.partners.createIntegration(user.id, id, input), "Partner integration created"); }

  @Get(":id/webhooks")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listWebhooks(@Param("id") id: string) { return ok(await this.partners.listWebhooks(id)); }

  @Post(":id/webhooks")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createWebhook(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: CreateWebhookDto) { return ok(await this.partners.createWebhook(user.id, id, input), "Partner webhook created"); }

  @Patch(":id/webhooks/:webhookId")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateWebhook(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Param("webhookId") webhookId: string, @Body() input: UpdateWebhookDto) { return ok(await this.partners.updateWebhook(user.id, id, webhookId, input)); }
}

@Controller("partner/v1")
@UseGuards(PartnerApiKeyGuard)
export class PartnerApiController {
  constructor(private readonly partners: PartnersService) {}

  @Get("me")
  async me(@Req() request: { partner?: PartnerApiPrincipal }) {
    return ok(await this.partners.dashboard(request.partner!.partnerId));
  }

  @Get("catalog/businesses") @PartnerScopes("catalog.read")
  async businesses(@Query("limit") limit?: string) { return ok(await this.partners.catalogBusinesses(this.limit(limit))); }

  @Get("catalog/categories") @PartnerScopes("catalog.read")
  async categories() { return ok(await this.partners.catalogCategories()); }

  @Get("catalog/locations/countries") @PartnerScopes("catalog.read")
  async countries() { return ok(await this.partners.catalogCountries()); }

  @Get("catalog/locations/cities") @PartnerScopes("catalog.read")
  async cities(@Query("countryId") countryId?: string) { return ok(await this.partners.catalogCities(countryId)); }

  @Get("catalog/deals") @PartnerScopes("catalog.read")
  async deals(@Query("limit") limit?: string) { return ok(await this.partners.catalogDeals(this.limit(limit))); }

  @Get("webhooks") @PartnerScopes("webhooks.read")
  async webhooks(@Req() request: { partner?: PartnerApiPrincipal }) { return ok(await this.partners.listWebhooks(request.partner!.partnerId)); }

  @Post("webhooks/test") @PartnerScopes("webhooks.test")
  async testWebhook(@Req() request: { partner?: PartnerApiPrincipal }) { return ok(await this.partners.queueWebhookTest(request.partner!.partnerId), "Webhook test queued"); }

  private limit(value?: string) { const parsed = Number(value ?? 20); return Number.isInteger(parsed) && parsed >= 1 && parsed <= 50 ? parsed : 20; }
}
