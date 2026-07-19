import { Body, Controller, ForbiddenException, Get, Headers, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { ok } from "../../common/api-response";
import { CreatePaymentDto, FinanceService, PaymentWebhookDto } from "./finance.service";

@Controller()
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get("wallet") @UseGuards(JwtAuthGuard)
  wallet(@CurrentUser() user: AuthenticatedUser) { return this.finance.wallet(user.id).then((data) => ok(data)); }

  @Get("wallet/transactions") @UseGuards(JwtAuthGuard)
  transactions(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) { return this.finance.walletTransactions(user.id, Number(limit) || 50).then((data) => ok(data)); }

  @Get("cashback") @UseGuards(JwtAuthGuard)
  cashback(@CurrentUser() user: AuthenticatedUser) { return this.finance.cashback(user.id).then((data) => ok(data)); }

  @Post("payments/create") @UseGuards(JwtAuthGuard)
  createPayment(@CurrentUser() user: AuthenticatedUser, @Body() input: CreatePaymentDto) { return this.finance.createPayment(user.id, input).then((data) => ok(data, "Payment intent created")); }

  @Get("payments/history") @UseGuards(JwtAuthGuard)
  history(@CurrentUser() user: AuthenticatedUser) { return this.finance.paymentHistory(user.id).then((data) => ok(data)); }

  @Get("payments/:id") @UseGuards(JwtAuthGuard)
  payment(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.finance.payment(user.id, id).then((data) => ok(data)); }

  @Post("payments/webhook")
  webhook(@Headers("x-payment-webhook-secret") secret: string | undefined, @Body() input: PaymentWebhookDto) {
    const expected = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!expected || !secret || secret !== expected) throw new ForbiddenException("PAYMENT_WEBHOOK_SIGNATURE_INVALID");
    return this.finance.handleWebhook(input).then((data) => ok(data, "Payment webhook processed"));
  }

  @Get("business/finance") @UseGuards(JwtAuthGuard)
  businessFinance(@CurrentUser() user: AuthenticatedUser, @Query("businessId") businessId?: string) {
    if (!businessId) throw new ForbiddenException("BUSINESS_ID_REQUIRED");
    return this.finance.businessFinance(user.id, businessId).then((data) => ok(data));
  }

  @Get("admin/finance") @UseGuards(JwtAuthGuard, AdminGuard)
  adminFinance() { return this.finance.adminSummary().then((data) => ok(data)); }
}
