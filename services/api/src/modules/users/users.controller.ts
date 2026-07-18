import { Body, Controller, Get, Patch, Put, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser, JwtAuthGuard, AuthenticatedUser } from "../../common/security";
import { UpdateProfileDto, UpdateUserInterestsDto, UpdateUserLocationDto, UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("profile") async getProfile(@CurrentUser() user: AuthenticatedUser) { return ok(await this.users.getProfile(user.id)); }
  @Get("me") async getMe(@CurrentUser() user: AuthenticatedUser) { return ok(await this.users.getProfile(user.id)); }
  @Patch("profile") async updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateProfileDto) { return ok(await this.users.updateProfile(user.id, input)); }
  @Put("me") async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateProfileDto) { return ok(await this.users.updateProfile(user.id, input)); }
  @Get("location") async getLocation(@CurrentUser() user: AuthenticatedUser) { return ok(await this.users.getPrimaryLocation(user.id)); }
  @Put("location") async updateLocation(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateUserLocationDto) { return ok(await this.users.updatePrimaryLocation(user.id, input)); }
  @Put("interests") async updateInterests(@CurrentUser() user: AuthenticatedUser, @Body() input: UpdateUserInterestsDto) { return ok(await this.users.updateInterests(user.id, input)); }
}
