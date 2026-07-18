import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@balkanworks/database";

export type AuthenticatedUser = { id: string; email: string };

type RequestWithUser = {
  headers: { authorization?: string | undefined };
  user?: AuthenticatedUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!token || !secret) throw new UnauthorizedException("AUTHENTICATION_REQUIRED");

    try {
      const payload = await this.jwt.verifyAsync<{ sub?: string; email?: string }>(token, { secret });
      if (!payload.sub || !payload.email) throw new UnauthorizedException("INVALID_ACCESS_TOKEN");
      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException("INVALID_ACCESS_TOKEN");
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) throw new UnauthorizedException("AUTHENTICATION_REQUIRED");

    const user = await this.prisma.user.findUnique({
      where: { id: request.user.id },
      include: { roles: { include: { role: true } } },
    });
    const isAdmin = user?.roles.some(({ role }) => role.name === "ADMIN" || role.name === "SUPER_ADMIN");
    if (!isAdmin) throw new ForbiddenException("ADMIN_PERMISSION_REQUIRED");
    return true;
  }
}

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): AuthenticatedUser => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  if (!request.user) throw new UnauthorizedException("AUTHENTICATION_REQUIRED");
  return request.user;
});
