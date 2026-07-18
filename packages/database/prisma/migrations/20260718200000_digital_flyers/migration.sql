-- Shared business-growth module: publishable digital flyers and view analytics.
CREATE TYPE "FlyerStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "digital_flyers" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "action_url" TEXT,
    "status" "FlyerStatus" NOT NULL DEFAULT 'DRAFT',
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "digital_flyers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "flyer_views" (
    "id" UUID NOT NULL,
    "flyer_id" UUID NOT NULL,
    "user_id" UUID,
    "source" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "flyer_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "digital_flyers_business_id_status_idx" ON "digital_flyers"("business_id", "status");
CREATE INDEX "digital_flyers_status_expires_at_idx" ON "digital_flyers"("status", "expires_at");
CREATE INDEX "flyer_views_flyer_id_created_at_idx" ON "flyer_views"("flyer_id", "created_at");

ALTER TABLE "digital_flyers" ADD CONSTRAINT "digital_flyers_business_id_fkey"
  FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "flyer_views" ADD CONSTRAINT "flyer_views_flyer_id_fkey"
  FOREIGN KEY ("flyer_id") REFERENCES "digital_flyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
