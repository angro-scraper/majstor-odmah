import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { CreateNotificationDto, NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser) { return ok(await this.notifications.listForUser(user.id)); }

  @Patch(":id/read")
  async markRead(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) { return ok(await this.notifications.markRead(user.id, id)); }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() input: CreateNotificationDto) { return ok(await this.notifications.create(input), "Notification created"); }
}
