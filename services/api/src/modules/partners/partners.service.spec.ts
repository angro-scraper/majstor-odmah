import { PartnersService } from "./partners.service";

describe("PartnersService", () => {
  it("issues a raw partner key once while persisting only its hash", async () => {
    const prisma = {
      partner: { findFirst: jest.fn().mockResolvedValue({ id: "partner-1" }) },
      partnerApiKey: { create: jest.fn().mockResolvedValue({ id: "key-1", label: "Production", keyPrefix: "bwpk_live_abc", scopes: ["partner.profile.read"], expiresAt: null, createdAt: new Date() }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const service = new PartnersService(prisma as never);

    const result = await service.createApiKey("admin-1", "partner-1", { label: "Production" });

    expect(result.apiKey).toMatch(/^bwpk_live_/);
    expect(prisma.partnerApiKey.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ keyHash: expect.any(String), keyPrefix: result.apiKey.slice(0, 16) }),
    }));
    expect(prisma.partnerApiKey.create.mock.calls[0][0].data.keyHash).not.toBe(result.apiKey);
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ action: "PARTNER_API_KEY_CREATED" }) }));
  });

  it("creates a webhook with an encrypted signing secret that is revealed only once", async () => {
    const previousKey = process.env.WEBHOOK_ENCRYPTION_KEY;
    process.env.WEBHOOK_ENCRYPTION_KEY = "test-webhook-encryption-key";
    const prisma = {
      partner: { findFirst: jest.fn().mockResolvedValue({ id: "partner-1" }) },
      partnerWebhookSubscription: { create: jest.fn().mockResolvedValue({ id: "webhook-1", endpointUrl: "https://hooks.example.com/events", eventTypes: ["OFFER_PUBLISHED"], status: "ACTIVE", createdAt: new Date() }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const service = new PartnersService(prisma as never);

    const result = await service.createWebhook("admin-1", "partner-1", { endpointUrl: "https://hooks.example.com/events", eventTypes: ["OFFER_PUBLISHED"] });

    expect(result.signingSecret).toMatch(/^bwps_/);
    expect(prisma.partnerWebhookSubscription.create.mock.calls[0][0].data.signingSecretEncrypted).not.toContain(result.signingSecret);
    expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ action: "PARTNER_WEBHOOK_CREATED" }) }));
    process.env.WEBHOOK_ENCRYPTION_KEY = previousKey;
  });
});
