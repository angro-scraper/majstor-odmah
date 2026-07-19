export type AiIntent = {
  type: "business_discovery";
  needs: string[];
  urgency: "normal" | "urgent";
  budget: "standard" | "value";
  confidence: "low" | "medium" | "high";
};

export type AiRecommendation = {
  entityType: "business" | "offer" | "save_food_package";
  entityId: string;
  title: string;
  subtitle: string;
  score: number;
  reason: string;
  actionUrl: string;
};
