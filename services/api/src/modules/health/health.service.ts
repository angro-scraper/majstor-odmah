import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  liveness() {
    return { status: "ok", service: "balkanworks-api", timestamp: new Date().toISOString() };
  }

  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ready", service: "balkanworks-api", checks: { database: "ok" }, timestamp: new Date().toISOString() };
    } catch {
      throw new ServiceUnavailableException("DATABASE_NOT_READY");
    }
  }
}
