import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, PaymentProvider, PaymentStatus, WalletTransactionStatus, WalletTransactionType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from "class-validator";
import { PrismaService } from "@balkanworks/database";
import { ManualPaymentProvider } from "./providers/manual-payment.provider";

export class CreatePaymentDto {
  @IsUUID() businessId!: string;
  @IsString() @MaxLength(120) reference!: string;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(1) amount!: number;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsOptional() @IsString() @MaxLength(128) idempotencyKey?: string;
}

export class PaymentWebhookDto {
  @IsString() @MaxLength(255) providerReference!: string;
  @IsEnum(PaymentStatus) status!: PaymentStatus;
  @IsOptional() @IsString() @MaxLength(255) eventId?: string;
}

const asMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService, private readonly manualProvider: ManualPaymentProvider) {}

  async wallet(userId: string) {
    const wallet = await this.ensureWallet(userId);
    const totals = await this.prisma.walletTransaction.groupBy({
      by: ["type"],
      where: { walletId: wallet.id, status: WalletTransactionStatus.SUCCEEDED },
      _sum: { amount: true },
    });
    return { ...wallet, ledgerTotals: totals, note: "Wallet je evidencioni pregled; Balkan.works ne čuva sredstva korisnika." };
  }

  async walletTransactions(userId: string, limit = 50) {
    const wallet = await this.ensureWallet(userId);
    return this.prisma.walletTransaction.findMany({ where: { walletId: wallet.id }, orderBy: { createdAt: "desc" }, take: Math.min(limit, 100), include: { payment: { select: { id: true, reference: true, status: true, business: { select: { id: true, name: true } } } } } });
  }

  async paymentHistory(userId: string) {
    return this.prisma.payment.findMany({ where: { customerUserId: userId }, orderBy: { createdAt: "desc" }, take: 100, include: { business: { select: { id: true, name: true, slug: true } }, invoice: true } });
  }

  async payment(userId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({ where: { id: paymentId, customerUserId: userId }, include: { business: { select: { id: true, name: true, slug: true } }, invoice: true } });
    if (!payment) throw new NotFoundException("PAYMENT_NOT_FOUND");
    return payment;
  }

  async createPayment(userId: string, input: CreatePaymentDto) {
    const business = await this.prisma.business.findFirst({ where: { id: input.businessId, deletedAt: null } });
    if (!business) throw new NotFoundException("BUSINESS_NOT_FOUND");
    const idempotencyKey = input.idempotencyKey ?? `${userId}:${input.businessId}:${input.reference}`;
    const existing = await this.prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existing) {
      if (existing.customerUserId !== userId) throw new ForbiddenException("PAYMENT_IDEMPOTENCY_KEY_CONFLICT");
      return existing;
    }
    const amount = asMoney(input.amount);
    const basisPoints = Number(process.env.PLATFORM_COMMISSION_BPS ?? 500);
    const commission = asMoney((input.amount * basisPoints) / 10_000);
    const payment = await this.prisma.payment.create({ data: { customerUserId: userId, businessId: business.id, provider: PaymentProvider.MANUAL, idempotencyKey, reference: input.reference, amount, commissionAmount: commission, netAmount: asMoney(amount - commission), currency: (input.currency ?? "RSD").toUpperCase(), status: PaymentStatus.PENDING } });
    const intent = await this.manualProvider.createIntent({ paymentId: payment.id, amount: input.amount, currency: payment.currency, reference: input.reference });
    const updated = await this.prisma.payment.update({ where: { id: payment.id }, data: { providerReference: intent.providerReference, status: intent.status } });
    await this.prisma.auditLog.create({ data: { actorUserId: userId, action: "PAYMENT_INTENT_CREATED", resourceType: "payment", resourceId: payment.id, payload: { provider: payment.provider, amount: input.amount, currency: payment.currency, businessId: business.id } } });
    return { payment: updated, checkout: { provider: payment.provider, checkoutUrl: intent.checkoutUrl, requiresAction: true } };
  }

  async cashback(userId: string) {
    const wallet = await this.ensureWallet(userId);
    return this.prisma.walletTransaction.findMany({ where: { walletId: wallet.id, type: WalletTransactionType.CASHBACK }, orderBy: { createdAt: "desc" }, take: 100, include: { payment: { select: { id: true, reference: true, business: { select: { id: true, name: true } } } } } });
  }

  async handleWebhook(input: PaymentWebhookDto) {
    const payment = await this.prisma.payment.findUnique({ where: { providerReference: input.providerReference } });
    if (!payment) throw new NotFoundException("PAYMENT_NOT_FOUND");
    if (payment.status === input.status) return payment;
    if (input.status !== PaymentStatus.SUCCEEDED) {
      return this.prisma.payment.update({ where: { id: payment.id }, data: { status: input.status } });
    }
    return this.settlePayment(payment.id, input.eventId);
  }

  async businessFinance(ownerUserId: string, businessId: string) {
    const business = await this.prisma.business.findFirst({ where: { id: businessId, ownerId: ownerUserId, deletedAt: null }, select: { id: true, name: true } });
    if (!business) throw new ForbiddenException("BUSINESS_OWNERSHIP_REQUIRED");
    const [totals, transactions, invoices] = await Promise.all([
      this.prisma.businessTransaction.aggregate({ where: { businessId }, _sum: { grossAmount: true, commissionAmount: true, netAmount: true }, _count: true }),
      this.prisma.businessTransaction.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50, include: { payment: { select: { id: true, reference: true, customer: { select: { id: true, email: true } } } } } }),
      this.prisma.invoice.findMany({ where: { businessId }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);
    return { business, totals, transactions, invoices };
  }

  async adminSummary() {
    const [payments, businessTotals, riskEvents] = await Promise.all([
      this.prisma.payment.aggregate({ _count: true, _sum: { amount: true, commissionAmount: true, netAmount: true } }),
      this.prisma.businessTransaction.count({ where: { status: PaymentStatus.SUCCEEDED } }),
      this.prisma.auditLog.count({ where: { action: "FINANCIAL_RISK_FLAGGED" } }),
    ]);
    return { payments, settledBusinessTransactions: businessTotals, riskEvents };
  }

  private async settlePayment(paymentId: string, providerEventId?: string) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new NotFoundException("PAYMENT_NOT_FOUND");
      if (payment.status === PaymentStatus.SUCCEEDED) return payment;
      const wallet = await tx.wallet.upsert({ where: { userId: payment.customerUserId }, create: { userId: payment.customerUserId, currency: payment.currency }, update: {} });
      const riskFlags = await this.riskFlags(tx, payment.customerUserId, Number(payment.amount));
      const settled = await tx.payment.update({ where: { id: payment.id }, data: { status: PaymentStatus.SUCCEEDED, completedAt: new Date(), metadata: { providerEventId: providerEventId ?? null, riskFlags } } });
      const existingLedger = await tx.walletTransaction.findFirst({ where: { paymentId: payment.id, type: WalletTransactionType.PAYMENT } });
      if (!existingLedger) await tx.walletTransaction.create({ data: { walletId: wallet.id, paymentId: payment.id, type: WalletTransactionType.PAYMENT, status: WalletTransactionStatus.SUCCEEDED, amount: payment.amount, currency: payment.currency, reference: payment.reference } });
      await tx.businessTransaction.upsert({ where: { businessId_paymentId: { businessId: payment.businessId, paymentId: payment.id } }, create: { businessId: payment.businessId, paymentId: payment.id, grossAmount: payment.amount, commissionAmount: payment.commissionAmount, netAmount: payment.netAmount, currency: payment.currency, status: PaymentStatus.SUCCEEDED, settledAt: new Date() }, update: { status: PaymentStatus.SUCCEEDED, settledAt: new Date() } });
      await tx.invoice.upsert({ where: { paymentId: payment.id }, create: { businessId: payment.businessId, customerUserId: payment.customerUserId, paymentId: payment.id, reference: `BW-${payment.id.slice(0, 8).toUpperCase()}`, amount: payment.amount, currency: payment.currency, status: "PAID", issuedAt: new Date(), paidAt: new Date() }, update: { status: "PAID", paidAt: new Date() } });
      await tx.auditLog.create({ data: { actorUserId: payment.customerUserId, action: "PAYMENT_SETTLED", resourceType: "payment", resourceId: payment.id, payload: { providerEventId: providerEventId ?? null, amount: payment.amount.toString(), currency: payment.currency } } });
      if (riskFlags.length) await tx.auditLog.create({ data: { actorUserId: payment.customerUserId, action: "FINANCIAL_RISK_FLAGGED", resourceType: "payment", resourceId: payment.id, payload: { flags: riskFlags } } });
      return settled;
    });
  }

  private async ensureWallet(userId: string) { return this.prisma.wallet.upsert({ where: { userId }, create: { userId }, update: {} }); }

  private async riskFlags(tx: Prisma.TransactionClient, userId: string, amount: number) {
    const flags: string[] = [];
    if (amount >= Number(process.env.FRAUD_REVIEW_AMOUNT ?? 50_000)) flags.push("HIGH_VALUE");
    const recent = await tx.payment.count({ where: { customerUserId: userId, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } } });
    if (recent >= 5) flags.push("HIGH_FREQUENCY");
    return flags;
  }
}
