import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { Prisma } from "@prisma/client";

@Injectable()
export class AiModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async assertSafe(userId: string | undefined, message: string, surface: string) {
    const normalized = message.toLocaleLowerCase("sr-Latn-RS");
    const blocked = ["ignore previous instructions", "system prompt", "otkrij lozinku", "ukradi karticu"]
      .some((phrase) => normalized.includes(phrase));

    if (blocked) {
      await this.audit(userId, "AI_REQUEST_BLOCKED", surface, { reason: "unsafe_instruction", length: message.length });
      throw new BadRequestException("AI_REQUEST_NOT_ALLOWED");
    }
  }

  audit(userId: string | undefined, action: string, surface: string, payload: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: { actorUserId: userId, action, resourceType: "ai", resourceId: surface, payload: payload as Prisma.InputJsonValue },
    });
  }
}
