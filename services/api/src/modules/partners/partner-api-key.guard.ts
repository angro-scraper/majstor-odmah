import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "@balkanworks/database";
import { createHash } from "crypto";
import { FeaturesService } from "../features/features.service";

export type PartnerApiPrincipal = { partnerId: string; apiKeyId: string; scopes: string[] };
export const PARTNER_SCOPES = "partner-scopes";
export const PartnerScopes = (...scopes: string[]) => SetMetadata(PARTNER_SCOPES, scopes);

type PartnerRequest = {
  headers: { "x-partner-api-key"?: string | string[]; authorization?: string };
  path?: string;
  method?: string;
  partner?: PartnerApiPrincipal;
};

@Injectable()
export class PartnerApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly features: FeaturesService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.features.isEnabled("partnerApi")) throw new NotFoundException("PARTNER_API_DISABLED");
    const request = context.switchToHttp().getRequest<PartnerRequest>();
    const headerValue = request.headers["x-partner-api-key"];
    const apiKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!apiKey?.startsWith("bwpk_")) throw new UnauthorizedException("PARTNER_API_KEY_REQUIRED");

    const keyHash = createHash("sha256").update(apiKey).digest("hex");
    const apiKeyRecord = await this.prisma.partnerApiKey.findFirst({
      where: {
        keyHash,
        deletedAt: null,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        partner: { status: "ACTIVE", deletedAt: null },
      },
      select: { id: true, partnerId: true, scopes: true },
    });
    if (!apiKeyRecord) throw new UnauthorizedException("INVALID_PARTNER_API_KEY");

    const scopes = Array.isArray(apiKeyRecord.scopes) ? apiKeyRecord.scopes.filter((scope): scope is string => typeof scope === "string") : [];
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(PARTNER_SCOPES, [context.getHandler(), context.getClass()]) ?? [];
    if (requiredScopes.length && !requiredScopes.every((scope) => scopes.includes("*") || scopes.includes(scope))) throw new ForbiddenException("PARTNER_SCOPE_REQUIRED");
    request.partner = { partnerId: apiKeyRecord.partnerId, apiKeyId: apiKeyRecord.id, scopes };
    await this.prisma.$transaction([
      this.prisma.partnerApiKey.update({ where: { id: apiKeyRecord.id }, data: { lastUsedAt: new Date() } }),
      this.prisma.partnerApiRequest.create({ data: { partnerId: apiKeyRecord.partnerId, apiKeyId: apiKeyRecord.id, endpoint: `${request.method ?? "GET"} ${request.path ?? "/"}`, statusCode: 200 } }),
    ]);
    return true;
  }
}
