export type FeatureFlag = "deals" | "saveFood" | "marketplace" | "wallet" | "aiAssistant" | "health" | "auto" | "travel" | "realEstate" | "education" | "events" | "community" | "balkanCard";

export const featureFlags: Record<FeatureFlag, boolean> = {
  deals: process.env.DEALS_ENABLED === "true",
  saveFood: process.env.SAVE_FOOD_ENABLED === "true",
  marketplace: process.env.MARKETPLACE_ENABLED === "true",
  wallet: process.env.WALLET_ENABLED === "true",
  aiAssistant: process.env.AI_ASSISTANT_ENABLED === "true",
  health: process.env.HEALTH_ENABLED === "true",
  auto: process.env.AUTO_ENABLED === "true",
  travel: process.env.TRAVEL_ENABLED === "true",
  realEstate: process.env.REAL_ESTATE_ENABLED === "true",
  education: process.env.EDUCATION_ENABLED === "true",
  events: process.env.EVENTS_ENABLED === "true",
  community: process.env.COMMUNITY_ENABLED === "true",
  balkanCard: process.env.BALKAN_CARD_ENABLED === "true",
};
