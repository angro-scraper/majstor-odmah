import { HttpException } from "@nestjs/common";
import { SupportService } from "./support.service";

describe("SupportService", () => {
  const prisma = { contactInquiry: { count: jest.fn(), create: jest.fn() }, auditLog: { create: jest.fn() } };
  const service = new SupportService(prisma as never);
  beforeEach(() => jest.clearAllMocks());
  const payload = { name: "Marko Petrović", email: "marko@example.com", subject: "GENERAL" as const, message: "Potrebna mi je pomoć." };
  it("stores a validated inquiry and exposes no internal data", async () => {
    prisma.contactInquiry.count.mockResolvedValue(0); prisma.contactInquiry.create.mockResolvedValue({ id: "inquiry-1", subject: "GENERAL" }); prisma.auditLog.create.mockResolvedValue({});
    await expect(service.createInquiry(payload)).resolves.toEqual({ received: true });
    expect(prisma.contactInquiry.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ email: "marko@example.com" }) }));
  });
  it("rate limits repeated messages from one email", async () => {
    prisma.contactInquiry.count.mockResolvedValue(5);
    await expect(service.createInquiry(payload)).rejects.toBeInstanceOf(HttpException);
  });
});
