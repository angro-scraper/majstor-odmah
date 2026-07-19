-- AI intelligence audit trail. Prompts are intentionally not persisted here.
CREATE TABLE "recommendation_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" VARCHAR(500),
    "surface" TEXT NOT NULL DEFAULT 'AI',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recommendation_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "recommendation_events_user_id_created_at_idx"
  ON "recommendation_events"("user_id", "created_at");
CREATE INDEX "recommendation_events_entity_type_entity_id_created_at_idx"
  ON "recommendation_events"("entity_type", "entity_id", "created_at");

ALTER TABLE "recommendation_events"
  ADD CONSTRAINT "recommendation_events_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
