import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { PartnerIntegrationStatus, PartnerStatus, Prisma } from "@prisma/client";
import { createHash, randomBytes } from "crypto";
import { CreateIntegrationDto, CreatePartnerDto, CreatePartnerKeyDto, UpdatePartnerDto } from "./partners.dto";

const partnerSelect = {
  id: true, name: true, slug: true, category: true, level: true, status: true,
  contactName: true, contactEmail: true, website: true, description: true, createdAt: true, updatedAt: true,
} as const;

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actorUserId: string, input: CreatePartnerDto) {
    const slug = this.slugify(input.slug ?? input.name);
    const partner = await this.prisma.partner.create({
      data: { ...input, name: input.name.trim(), slug, contactEmail: input.contactEmail?.toLowerCase(), website: input.website?.trim(), description: input.description?.trim() },
      select: partnerSelect,
    });
    await this.audit(actorUserId, "PARTNER_CREATED", partner.id, { category: partner.category, level: partner.level });
    return partner;
  }

  async list() {
    return this.prisma.partner.findMany({
      where: { deletedAt: null }, select: { ...partnerSelect, _count: { select: { integrations: { where: { deletedAt: null } }, apiKeys: { where: { deletedAt: null, revokedAt: null } } } } }, orderBy: [{ status: "asc" }, { name: "asc" }],
    });
  }

  async update(actorUserId: string, id: string, input: UpdatePartnerDto) {
    await this.requirePartner(id);
    const partner = await this.prisma.partner.update({
      where: { id }, data: {
        ...input, name: input.name?.trim(), slug: input.slug ? this.slugify(input.slug) : undefined,
        contactEmail: input.contactEmail?.toLowerCase(), website: input.website?.trim(), description: input.description?.trim(),
      }, select: partnerSelect,
    });
    await this.audit(actorUserId, "PARTNER_UPDATED", id, { status: partner.status, level: partner.level });
    return partner;
  }

  async createApiKey(actorUserId: string, partnerId: string, input: CreatePartnerKeyDto) {
    await this.requirePartner(partnerId);
    const rawKey = `bwpk_live_${randomBytes(32).toString("base64url")}`;
    const key = await this.prisma.partnerApiKey.create({
      data: {
        partnerId, label: input.label.trim(), keyPrefix: rawKey.slice(0, 16), keyHash: createHash("sha256").update(rawKey).digest("hex"),
        scopes: input.scopes ?? ["partner.profile.read"], expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
      select: { id: true, label: true, keyPrefix: true, scopes: true, expiresAt: true, createdAt: true },
    });
    await this.audit(actorUserId, "PARTNER_API_KEY_CREATED", key.id, { partnerId, scopes: key.scopes });
    return { ...key, apiKey: rawKey, warning: "API ključ se prikazuje samo sada. Sačuvajte ga u sigurnom secrets manageru." };
  }

  async createIntegration(actorUserId: string, partnerId: string, input: CreateIntegrationDto) {
    await this.requirePartner(partnerId);
    const integration = await this.prisma.partnerIntegration.create({
      data: { partnerId, name: input.name.trim(), integrationType: input.integrationType.trim(), status: input.status ?? PartnerIntegrationStatus.PLANNED, scopes: input.scopes ?? [], configuration: (input.configuration ?? {}) as Prisma.InputJsonValue, startedAt: input.startedAt ? new Date(input.startedAt) : null },
    });
    await this.audit(actorUserId, "PARTNER_INTEGRATION_CREATED", integration.id, { partnerId, integrationType: integration.integrationType });
    return integration;
  }

  async publicProfile(slug: string) {
    const partner = await this.prisma.partner.findFirst({ where: { slug, status: PartnerStatus.ACTIVE, deletedAt: null }, select: { name: true, slug: true, category: true, level: true, website: true, description: true, integrations: { where: { status: PartnerIntegrationStatus.ACTIVE, deletedAt: null }, select: { name: true, integrationType: true } } } });
    if (!partner) throw new NotFoundException("PARTNER_NOT_FOUND");
    return partner;
  }

  async dashboard(partnerId: string) {
    const since = new Date(); since.setDate(since.getDate() - 30);
    const [partner, totalRequests, recentRequests, activeIntegrations] = await Promise.all([
      this.prisma.partner.findFirst({ where: { id: partnerId, status: PartnerStatus.ACTIVE, deletedAt: null }, select: { ...partnerSelect, integrations: { where: { deletedAt: null }, select: { id: true, name: true, integrationType: true, status: true, scopes: true, startedAt: true } } } }),
      this.prisma.partnerApiRequest.count({ where: { partnerId, createdAt: { gte: since } } }),
      this.prisma.partnerApiRequest.findMany({ where: { partnerId }, orderBy: { createdAt: "desc" }, take: 10, select: { endpoint: true, statusCode: true, createdAt: true } }),
      this.prisma.partnerIntegration.count({ where: { partnerId, status: PartnerIntegrationStatus.ACTIVE, deletedAt: null } }),
    ]);
    if (!partner) throw new NotFoundException("PARTNER_NOT_FOUND");
    return { partner, metrics: { apiRequestsLast30Days: totalRequests, activeIntegrations }, recentApiActivity: recentRequests, nextSteps: activeIntegrations ? ["Pratite API korišćenje i rezultate zajedničkih kampanja."] : ["Dogovorite pilot integraciju pre aktiviranja produkcionog pristupa."] };
  }

  private async requirePartner(id: string) {
    const partner = await this.prisma.partner.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
    if (!partner) throw new NotFoundException("PARTNER_NOT_FOUND");
    return partner;
  }

  private async audit(actorUserId: string, action: string, resourceId: string, payload: Record<string, unknown>) {
    await this.prisma.auditLog.create({ data: { actorUserId, action, resourceType: "partner", resourceId, payload: payload as Prisma.InputJsonValue } });
  }

  private slugify(value: string) {
    const slug = value.toLocaleLowerCase("sr-Latn").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) throw new BadRequestException("PARTNER_SLUG_REQUIRED");
    return slug;
  }
}
