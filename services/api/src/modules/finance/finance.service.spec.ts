import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { FinanceService } from "./finance.service";

describe("FinanceService", () => {
  const prisma = {
    wallet: { upsert: jest.fn() },
    walletTransaction: { groupBy: jest.fn() },
    business: { findFirst: jest.fn() },
    payment: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  const provider = { createIntent: jest.fn() };
  const service = new FinanceService(prisma as never, provider as never);

  beforeEach(() => jest.clearAllMocks());

  it("creates an accounting-only wallet without claiming to hold customer funds", async () => {
    prisma.wallet.upsert.mockResolvedValue({ id: "wallet-1", userId: "user-1", currency: "RSD", status: "ACTIVE" });
    prisma.walletTransaction.groupBy.mockResolvedValue([]);

    const result = await service.wallet("user-1");

    expect(prisma.wallet.upsert).toHaveBeenCalledWith({ where: { userId: "user-1" }, create: { userId: "user-1" }, update: {} });
    expect(result.note).toContain("ne čuva sredstva");
  });

  it("creates an idempotent provider intent and computes the platform commission", async () => {
    prisma.business.findFirst.mockResolvedValue({ id: "business-1" });
    prisma.payment.findUnique.mockResolvedValue(null);
    prisma.payment.create.mockResolvedValue({ id: "payment-1", businessId: "business-1", provider: PaymentProvider.MANUAL, currency: "RSD" });
    provider.createIntent.mockResolvedValue({ providerReference: "manual_payment-1", status: PaymentStatus.REQUIRES_ACTION, checkoutUrl: null });
    prisma.payment.update.mockResolvedValue({ id: "payment-1", status: PaymentStatus.REQUIRES_ACTION });
    prisma.auditLog.create.mockResolvedValue({});

    const result = await service.createPayment("user-1", { businessId: "business-1", reference: "save-food-1", amount: 1000 });

    expect(prisma.payment.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ amount: 1000, commissionAmount: 50, netAmount: 950 }) }));
    expect(result.checkout.requiresAction).toBe(true);
  });
});
