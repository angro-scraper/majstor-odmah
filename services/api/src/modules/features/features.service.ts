import { Injectable } from "@nestjs/common";

export type FeatureKey = "deals" | "digitalFlyers" | "saveFood" | "marketplace" | "wallet" | "aiAssistant" | "partnerApi" | "health" | "auto" | "travel" | "realEstate" | "education" | "events" | "community" | "balkanCard";

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
    health: parseFlag(process.env.HEALTH_ENABLED, false),
    auto: parseFlag(process.env.AUTO_ENABLED, false),
    travel: parseFlag(process.env.TRAVEL_ENABLED, false),
    realEstate: parseFlag(process.env.REAL_ESTATE_ENABLED, false),
    education: parseFlag(process.env.EDUCATION_ENABLED, false),
    events: parseFlag(process.env.EVENTS_ENABLED, true),
    community: parseFlag(process.env.COMMUNITY_ENABLED, true),
    balkanCard: parseFlag(process.env.BALKAN_CARD_ENABLED, true),
  };

  isEnabled(feature: FeatureKey): boolean { return this.flags[feature]; }

  publicFlags(): Readonly<Record<FeatureKey, boolean>> { return this.flags; }
}
