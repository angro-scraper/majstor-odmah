import { PaymentProvider, PaymentStatus } from "@prisma/client";

export type PaymentIntentRequest = {
  paymentId: string;
  amount: number;
  currency: string;
  reference: string;
};

export type PaymentIntent = {
  providerReference: string;
  status: PaymentStatus;
  checkoutUrl: string | null;
};

/**
 * Providers receive only the amount, currency, and platform reference. Card and
 * bank credentials never enter the Balkan.works API or database.
 */
export interface PaymentProviderAdapter {
  readonly provider: PaymentProvider;
  createIntent(request: PaymentIntentRequest): Promise<PaymentIntent>;
}
