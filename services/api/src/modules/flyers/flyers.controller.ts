import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateFlyerDto, FlyersService, ListFlyersDto, UpdateFlyerDto } from "./flyers.service";

@Controller("flyers")
export class FlyersController {
  constructor(private readonly flyers: FlyersService) {}

  @Get()
  async list(@Query() input: ListFlyersDto) { return ok(await this.flyers.list(input)); }

  @Get(":id")
  async get(@Param("id") id: string) { return ok(await this.flyers.findPublic(id)); }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateFlyerDto) { return ok(await this.flyers.create(user.id, input), "Digital flyer created"); }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: UpdateFlyerDto) { return ok(await this.flyers.update(user.id, id, input)); }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard)
  async publish(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return ok(await this.flyers.publish(user.id, id), "Digital flyer published"); }

  @Post(":id/view")
  @UseGuards(JwtAuthGuard)
  async view(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return ok(await this.flyers.recordView(user.id, id)); }
}
