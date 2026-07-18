import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@balkanworks/database";
import * as bcrypt from "bcrypt";
import { ok } from "../../common/api-response";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(input: RegisterDto) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email }, ...(input.phone ? [{ phone: input.phone }] : [])] } });
    if (existing) throw new ConflictException("AUTH_IDENTITY_EXISTS");
    const user = await this.prisma.user.create({ data: { email, phone: input.phone, passwordHash: await bcrypt.hash(input.password, 12), profile: { create: { firstName: input.firstName.trim(), lastName: input.lastName.trim() } } } });
    return this.createSession(user.id, user.email);
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email.trim().toLowerCase() } });
    if (!user || user.status === "BLOCKED" || !(await bcrypt.compare(input.password, user.passwordHash))) throw new UnauthorizedException("INVALID_CREDENTIALS");
    return this.createSession(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException("JWT_NOT_CONFIGURED");
    let payload: { sub?: string; type?: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret });
    } catch {
      throw new UnauthorizedException("INVALID_REFRESH_TOKEN");
    }
    if (!payload.sub || payload.type !== "refresh") throw new UnauthorizedException("INVALID_REFRESH_TOKEN");

    const tokenHash = this.hashRefreshToken(refreshToken);
    const session = await this.prisma.authSession.findFirst({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        // Keep a brief compatibility path for sessions created before token hashing.
        OR: [{ refreshToken: tokenHash }, { refreshToken }],
      },
      include: { user: true },
    });
    if (!session || session.user.status === "BLOCKED" || session.user.deletedAt) throw new UnauthorizedException("INVALID_REFRESH_TOKEN");
    await this.prisma.authSession.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    return this.createSession(session.userId, session.user.email);
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.prisma.authSession.updateMany({
      where: { revokedAt: null, OR: [{ refreshToken: tokenHash }, { refreshToken }] },
      data: { revokedAt: new Date() },
    });
    return ok({ logged_out: true }, "Session revoked");
  }

  private async createSession(userId: string, email: string) {
    const secret = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException("JWT_NOT_CONFIGURED");
    const accessToken = await this.jwt.signAsync({ sub: userId, email }, { secret, expiresIn: "15m" });
    const refreshToken = await this.jwt.signAsync({ sub: userId, type: "refresh" }, { secret: process.env.JWT_REFRESH_SECRET || secret, expiresIn: "30d" });
    await this.prisma.authSession.create({ data: { userId, refreshToken: this.hashRefreshToken(refreshToken), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    return ok({ access_token: accessToken, refresh_token: refreshToken, user_id: userId });
  }

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
