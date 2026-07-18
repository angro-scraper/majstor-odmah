-- Sprint 03: complete the business identity, follower and multipage flyer foundations.
ALTER TABLE "businesses"
  ADD COLUMN "cover_url" TEXT,
  ADD COLUMN "social_links" JSONB NOT NULL DEFAULT '{}';

CREATE TABLE "business_followers" (
  "user_id" UUID NOT NULL,
  "business_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "business_followers_pkey" PRIMARY KEY ("user_id", "business_id")
);

CREATE INDEX "business_followers_business_id_created_at_idx"
  ON "business_followers"("business_id", "created_at");

ALTER TABLE "business_followers"
  ADD CONSTRAINT "business_followers_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "business_followers"
  ADD CONSTRAINT "business_followers_business_id_fkey"
  FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "flyer_pages" (
  "id" UUID NOT NULL,
  "flyer_id" UUID NOT NULL,
  "image_url" TEXT NOT NULL,
  "page_number" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "flyer_pages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "flyer_pages_flyer_id_page_number_key" UNIQUE ("flyer_id", "page_number")
);

ALTER TABLE "flyer_pages"
  ADD CONSTRAINT "flyer_pages_flyer_id_fkey"
  FOREIGN KEY ("flyer_id") REFERENCES "digital_flyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
