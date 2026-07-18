export type FeatureFlag = "deals" | "saveFood" | "marketplace" | "wallet" | "aiAssistant";

export const featureFlags: Record<FeatureFlag, boolean> = {
  deals: process.env.DEALS_ENABLED === "true",
  saveFood: process.env.SAVE_FOOD_ENABLED === "true",
  marketplace: process.env.MARKETPLACE_ENABLED === "true",
  wallet: process.env.WALLET_ENABLED === "true",
  aiAssistant: process.env.AI_ASSISTANT_ENABLED === "true",
};
