import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateOfferDto, ListOffersDto, OffersService, UpdateOfferDto } from "./offers.service";

@Controller("offers")
export class OffersController {
  constructor(private readonly offers: OffersService) {}

  @Get()
  async list(@Query() query: ListOffersDto) { return ok(await this.offers.listActive(query)); }

  @Get(":id")
  async get(@Param("id") id: string) { return ok(await this.offers.findPublic(id)); }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateOfferDto) {
    return ok(await this.offers.create(user.id, input), "Offer created");
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Body() input: UpdateOfferDto) {
    return ok(await this.offers.update(id, user.id, input));
  }

  @Post(":id/save")
  @UseGuards(JwtAuthGuard)
  async save(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return ok(await this.offers.save(user.id, id), "Offer saved");
  }
}
