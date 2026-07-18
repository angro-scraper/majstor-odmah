import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser, JwtAuthGuard, AuthenticatedUser } from "../../common/security";
import { UpdateProfileDto, UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("profile") async getProfile(@CurrentUser() user: AuthenticatedUser) { return ok(await this.users.getProfile(user.id)); }
  @Patch("profile") async updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateProfileDto) { return ok(await this.users.updateProfile(user.id, input)); }
}
