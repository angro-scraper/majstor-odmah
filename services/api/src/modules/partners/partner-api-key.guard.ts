import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { createHash } from "crypto";

export type PartnerApiPrincipal = { partnerId: string; apiKeyId: string; scopes: string[] };

type PartnerRequest = {
  headers: { "x-partner-api-key"?: string | string[]; authorization?: string };
  path?: string;
  method?: string;
  partner?: PartnerApiPrincipal;
};

@Injectable()
export class PartnerApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    request.partner = { partnerId: apiKeyRecord.partnerId, apiKeyId: apiKeyRecord.id, scopes };
    await this.prisma.$transaction([
      this.prisma.partnerApiKey.update({ where: { id: apiKeyRecord.id }, data: { lastUsedAt: new Date() } }),
      this.prisma.partnerApiRequest.create({ data: { partnerId: apiKeyRecord.partnerId, apiKeyId: apiKeyRecord.id, endpoint: `${request.method ?? "GET"} ${request.path ?? "/"}`, statusCode: 200 } }),
    ]);
    return true;
  }
}
