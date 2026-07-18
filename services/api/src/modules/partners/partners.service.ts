import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@balkanworks/database";
import { PartnerIntegrationStatus, PartnerStatus, Prisma, WebhookStatus } from "@prisma/client";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { CreateIntegrationDto, CreatePartnerDto, CreatePartnerKeyDto, CreateWebhookDto, UpdatePartnerDto, UpdateWebhookDto } from "./partners.dto";

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
    if (this.containsSensitiveConfiguration(input.configuration)) {
      throw new BadRequestException("PARTNER_CONFIGURATION_MUST_NOT_CONTAIN_SECRETS");
    }
    const integration = await this.prisma.partnerIntegration.create({
      data: { partnerId, name: input.name.trim(), integrationType: input.integrationType.trim(), status: input.status ?? PartnerIntegrationStatus.PLANNED, scopes: input.scopes ?? [], configuration: (input.configuration ?? {}) as Prisma.InputJsonValue, startedAt: input.startedAt ? new Date(input.startedAt) : null },
    });
    await this.audit(actorUserId, "PARTNER_INTEGRATION_CREATED", integration.id, { partnerId, integrationType: integration.integrationType });
    return integration;
  }

  async revokeApiKey(actorUserId: string, partnerId: string, keyId: string) {
    const key = await this.prisma.partnerApiKey.findFirst({ where: { id: keyId, partnerId, deletedAt: null }, select: { id: true, revokedAt: true } });
    if (!key) throw new NotFoundException("PARTNER_API_KEY_NOT_FOUND");
    if (!key.revokedAt) await this.prisma.partnerApiKey.update({ where: { id: keyId }, data: { revokedAt: new Date() } });
    await this.audit(actorUserId, "PARTNER_API_KEY_REVOKED", keyId, { partnerId });
    return { id: keyId, revoked: true };
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

  async createWebhook(actorUserId: string, partnerId: string, input: CreateWebhookDto) {
    await this.requirePartner(partnerId);
    this.assertWebhookUrl(input.endpointUrl);
    const signingSecret = `bwps_${randomBytes(32).toString("base64url")}`;
    const webhook = await this.prisma.partnerWebhookSubscription.create({
      data: { partnerId, endpointUrl: input.endpointUrl, eventTypes: [...new Set(input.eventTypes)], signingSecretEncrypted: this.encryptSecret(signingSecret) },
      select: { id: true, endpointUrl: true, eventTypes: true, status: true, createdAt: true },
    });
    await this.audit(actorUserId, "PARTNER_WEBHOOK_CREATED", webhook.id, { partnerId, eventTypes: webhook.eventTypes });
    return { ...webhook, signingSecret, warning: "Webhook tajna se prikazuje samo sada. Sačuvajte je u sigurnom secrets manageru." };
  }

  async updateWebhook(actorUserId: string, partnerId: string, webhookId: string, input: UpdateWebhookDto) {
    const webhook = await this.prisma.partnerWebhookSubscription.findFirst({ where: { id: webhookId, partnerId, deletedAt: null }, select: { id: true } });
    if (!webhook) throw new NotFoundException("PARTNER_WEBHOOK_NOT_FOUND");
    const updated = await this.prisma.partnerWebhookSubscription.update({ where: { id: webhookId }, data: { status: input.status, eventTypes: input.eventTypes ? [...new Set(input.eventTypes)] : undefined }, select: { id: true, endpointUrl: true, eventTypes: true, status: true, updatedAt: true } });
    await this.audit(actorUserId, "PARTNER_WEBHOOK_UPDATED", webhookId, { partnerId, status: updated.status });
    return updated;
  }

  async listWebhooks(partnerId: string) {
    return this.prisma.partnerWebhookSubscription.findMany({
      where: { partnerId, deletedAt: null }, orderBy: { createdAt: "desc" },
      select: { id: true, endpointUrl: true, eventTypes: true, status: true, lastFailureAt: true, createdAt: true, updatedAt: true, _count: { select: { deliveries: true } } },
    });
  }

  async enqueueWebhookEvent(eventType: string, payload: Record<string, unknown>) {
    const subscriptions = await this.prisma.partnerWebhookSubscription.findMany({ where: { status: WebhookStatus.ACTIVE, deletedAt: null }, select: { id: true, eventTypes: true } });
    const matching = subscriptions.filter(({ eventTypes }) => Array.isArray(eventTypes) && eventTypes.includes(eventType));
    if (!matching.length) return { queued: 0 };
    await this.prisma.partnerWebhookDelivery.createMany({ data: matching.map((subscription) => ({ subscriptionId: subscription.id, eventType, payload: payload as Prisma.InputJsonValue })) });
    return { queued: matching.length };
  }

  async queueWebhookTest(partnerId: string) {
    return this.enqueueWebhookEvent("WEBHOOK_TEST", { eventId: randomBytes(12).toString("hex"), emittedAt: new Date().toISOString(), partnerId, environment: process.env.PARTNER_API_ENVIRONMENT ?? "development" });
  }

  async catalogBusinesses(limit = 20) {
    return this.prisma.business.findMany({ where: { deletedAt: null, status: "VERIFIED" }, select: { id: true, slug: true, name: true, description: true, phone: true, website: true, verificationStatus: true, category: { select: { name: true, slug: true, type: true } }, locations: { where: { deletedAt: null }, select: { address: true, city: { select: { name: true, country: { select: { code: true, name: true } } } } } } }, orderBy: { name: "asc" }, take: limit });
  }

  async catalogCategories() {
    return this.prisma.category.findMany({ where: { deletedAt: null }, select: { id: true, name: true, slug: true, icon: true, type: true }, orderBy: [{ type: "asc" }, { name: "asc" }] });
  }

  async catalogCountries() {
    return this.prisma.country.findMany({ where: { deletedAt: null }, select: { id: true, code: true, name: true, currency: true }, orderBy: { name: "asc" } });
  }

  async catalogCities(countryId?: string) {
    return this.prisma.city.findMany({ where: { deletedAt: null, ...(countryId ? { countryId } : {}) }, select: { id: true, name: true, latitude: true, longitude: true, country: { select: { code: true, name: true } } }, orderBy: { name: "asc" }, take: 100 });
  }

  async catalogDeals(limit = 20) {
    return this.prisma.offer.findMany({ where: { deletedAt: null, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }], business: { status: "VERIFIED", deletedAt: null } }, select: { id: true, title: true, description: true, imageUrl: true, price: true, discountPrice: true, currency: true, startsAt: true, expiresAt: true, business: { select: { id: true, slug: true, name: true } }, category: { select: { name: true, slug: true } } }, orderBy: [{ expiresAt: "asc" }, { createdAt: "desc" }], take: limit });
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

  private containsSensitiveConfiguration(value: Record<string, unknown> | undefined): boolean {
    if (!value) return false;
    const blockedKey = /(?:api[_-]?key|secret|token|password|credential)/i;
    return Object.entries(value).some(([key, item]) => blockedKey.test(key) || (typeof item === "object" && item !== null && !Array.isArray(item) && this.containsSensitiveConfiguration(item as Record<string, unknown>)));
  }

  private assertWebhookUrl(value: string) {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const privateIpv4 = /^(10\.|127\.|0\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;
    if (url.protocol !== "https:" || host === "localhost" || host.endsWith(".local") || privateIpv4.test(host)) throw new BadRequestException("PARTNER_WEBHOOK_URL_NOT_ALLOWED");
  }

  private encryptSecret(value: string) {
    const keySource = process.env.WEBHOOK_ENCRYPTION_KEY;
    if (!keySource) throw new BadRequestException("WEBHOOK_ENCRYPTION_NOT_CONFIGURED");
    const key = createHash("sha256").update(keySource).digest();
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${ciphertext.toString("base64url")}`;
  }
}
