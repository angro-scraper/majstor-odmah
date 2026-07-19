import { Injectable } from "@nestjs/common";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { PaymentIntent, PaymentIntentRequest, PaymentProviderAdapter } from "./payment-provider";

/** Safe default for development and sandbox environments. It never settles a payment. */
@Injectable()
export class ManualPaymentProvider implements PaymentProviderAdapter {
  readonly provider = PaymentProvider.MANUAL;

  async createIntent(request: PaymentIntentRequest): Promise<PaymentIntent> {
    return {
      providerReference: `manual_${request.paymentId}`,
      status: PaymentStatus.REQUIRES_ACTION,
      checkoutUrl: null,
    };
  }
}
