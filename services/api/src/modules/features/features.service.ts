import { Injectable } from "@nestjs/common";

export type FeatureKey = "deals" | "digitalFlyers" | "saveFood" | "marketplace" | "wallet" | "aiAssistant" | "partnerApi";

const parseFlag = (value: string | undefined, fallback: boolean) => value === undefined ? fallback : value.trim().toLowerCase() === "true";

@Injectable()
export class FeaturesService {
  private readonly flags: Readonly<Record<FeatureKey, boolean>> = {
    deals: parseFlag(process.env.DEALS_ENABLED, true),
    digitalFlyers: parseFlag(process.env.DIGITAL_FLYERS_ENABLED, false),
    saveFood: parseFlag(process.env.SAVE_FOOD_ENABLED, true),
    marketplace: parseFlag(process.env.MARKETPLACE_ENABLED, false),
    wallet: parseFlag(process.env.WALLET_ENABLED, false),
    aiAssistant: parseFlag(process.env.AI_ASSISTANT_ENABLED, true),
    partnerApi: parseFlag(process.env.PARTNER_API_ENABLED, false),
  };

  isEnabled(feature: FeatureKey): boolean { return this.flags[feature]; }

  publicFlags(): Readonly<Record<FeatureKey, boolean>> { return this.flags; }
}
