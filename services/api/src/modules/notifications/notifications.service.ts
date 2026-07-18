import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationType } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsEnum, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateNotificationDto {
  @IsUUID() userId!: string;
  @IsEnum(NotificationType) type!: NotificationType;
  @IsString() @MaxLength(160) title!: string;
  @IsString() @MaxLength(2000) message!: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.notification.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: "desc" }, take: 50 });
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId, deletedAt: null } });
    if (!notification) throw new NotFoundException("NOTIFICATION_NOT_FOUND");
    return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }

  async create(input: CreateNotificationDto) {
    return this.prisma.notification.create({ data: { userId: input.userId, type: input.type, title: input.title.trim(), message: input.message.trim() } });
  }
}
