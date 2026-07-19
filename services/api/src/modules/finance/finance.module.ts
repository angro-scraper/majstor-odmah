import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { ManualPaymentProvider } from "./providers/manual-payment.provider";

@Module({ controllers: [FinanceController], providers: [FinanceService, ManualPaymentProvider], exports: [FinanceService] })
export class FinanceModule {}
