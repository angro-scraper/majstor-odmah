import { Body, Controller, Delete, Get, Param, Post, Patch, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { BusinessesService, CreateBusinessDto, CreateServiceDto, ListBusinessesDto, UpdateBusinessDto } from "./businesses.service";

@Controller("businesses")
export class BusinessesController {
  constructor(private readonly businesses: BusinessesService) {}

  @Get()
  async list(@Query() query: ListBusinessesDto) { return ok(await this.businesses.listPublic(query)); }

  @Post() @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateBusinessDto) { return ok(await this.businesses.create(user.id, input), "Business created and awaiting review"); }

  @Get("slug/:slug") async getPublicBySlug(@Param("slug") slug: string) { return ok(await this.businesses.findPublicBySlug(slug)); }

  @Get("following") @UseGuards(JwtAuthGuard)
  async following(@CurrentUser() user: AuthenticatedUser) { return ok(await this.businesses.listFollowing(user.id)); }

  @Get(":id") async getPublic(@Param("id") id: string) { return ok(await this.businesses.findPublic(id)); }

  @Post(":id/view") @UseGuards(JwtAuthGuard)
  async view(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) { return ok(await this.businesses.recordView(id, user.id)); }

  @Post(":id/follow") @UseGuards(JwtAuthGuard)
  async follow(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) { return ok(await this.businesses.follow(id, user.id), "Business followed"); }

  @Delete(":id/follow") @UseGuards(JwtAuthGuard)
  async unfollow(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) { await this.businesses.unfollow(id, user.id); return ok({ id }, "Business unfollowed"); }

  @Patch(":id") @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Body() input: UpdateBusinessDto) { return ok(await this.businesses.update(id, user.id, input)); }

  @Delete(":id") @UseGuards(JwtAuthGuard)
  async archive(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) { await this.businesses.archive(id, user.id); return ok({ id }, "Business archived"); }

  @Post(":id/services") @UseGuards(JwtAuthGuard)
  async addService(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Body() input: CreateServiceDto) { return ok(await this.businesses.addService(id, user.id, input)); }

  @Post(":id/contact/:type") @UseGuards(JwtAuthGuard)
  async contact(@Param("id") id: string, @Param("type") type: "PHONE" | "EMAIL" | "MESSAGE" | "LOCATION", @CurrentUser() user: AuthenticatedUser) { return ok(await this.businesses.recordContact(id, user.id, type)); }
}
