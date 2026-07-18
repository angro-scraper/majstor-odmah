import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateSaveFoodPackageDto, ListSaveFoodPackagesDto, ReserveSaveFoodPackageDto, SaveFoodService, UpdateSaveFoodPackageDto } from "./save-food.service";

@Controller("save-food")
export class SaveFoodController {
  constructor(private readonly saveFood: SaveFoodService) {}
  @Get("packages") async list(@Query() query: ListSaveFoodPackagesDto) { return ok(await this.saveFood.list(query)); }
  @Get("packages/:id") async get(@Param("id") id: string) { return ok(await this.saveFood.findPublic(id)); }
  @Post("packages") @UseGuards(JwtAuthGuard) async create(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateSaveFoodPackageDto) { return ok(await this.saveFood.create(user.id, input), "Save Food package created"); }
  @Patch("packages/:id") @UseGuards(JwtAuthGuard) async update(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: UpdateSaveFoodPackageDto) { return ok(await this.saveFood.update(user.id, id, input)); }
  @Post("packages/:id/activate") @UseGuards(JwtAuthGuard) async activate(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return ok(await this.saveFood.activate(user.id, id)); }
  @Post("packages/:id/reserve") @UseGuards(JwtAuthGuard) async reserve(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: ReserveSaveFoodPackageDto) { return ok(await this.saveFood.reserve(user.id, id, input.quantity ?? 1), "Save Food package reserved"); }
  @Get("reservations/me") @UseGuards(JwtAuthGuard) async reservations(@CurrentUser() user: AuthenticatedUser) { return ok(await this.saveFood.reservations(user.id)); }
  @Post("reservations/:id/cancel") @UseGuards(JwtAuthGuard) async cancel(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return ok(await this.saveFood.cancel(user.id, id)); }
}
