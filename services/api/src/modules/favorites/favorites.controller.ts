import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { FavoriteBusinessDto, FavoritesService } from "./favorites.service";

@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}
  @Get() async list(@CurrentUser() user: AuthenticatedUser) { return ok(await this.favorites.list(user.id)); }
  @Post() async add(@CurrentUser() user: AuthenticatedUser, @Body() input: FavoriteBusinessDto) { return ok(await this.favorites.add(user.id, input.businessId)); }
  @Delete(":businessId") async remove(@CurrentUser() user: AuthenticatedUser, @Param("businessId") businessId: string) { await this.favorites.remove(user.id, businessId); return ok({ businessId }, "Favorite removed"); }
}
