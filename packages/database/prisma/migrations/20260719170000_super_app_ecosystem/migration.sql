-- Balkan.works Sprint 11: shared super-app modules.
-- Health records deliberately store only user-provided preferences and reminders.

CREATE TYPE "SuperAppModuleKey" AS ENUM ('HEALTH', 'AUTO', 'TRAVEL', 'REAL_ESTATE', 'EDUCATION', 'EVENTS', 'COMMUNITY', 'BALKAN_CARD');

CREATE TABLE "health_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL,
  "blood_type" VARCHAR(8), "allergies" JSONB NOT NULL DEFAULT '[]', "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "health_profiles_pkey" PRIMARY KEY ("id"), CONSTRAINT "health_profiles_user_id_key" UNIQUE ("user_id")
);
CREATE TABLE "health_reminders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "profile_id" UUID,
  "title" TEXT NOT NULL, "reminder_at" TIMESTAMP(3) NOT NULL, "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "health_reminders_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "health_reminders_user_id_reminder_at_idx" ON "health_reminders"("user_id", "reminder_at");

CREATE TABLE "vehicles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "make" TEXT NOT NULL, "model" TEXT NOT NULL,
  "year" INTEGER, "registration" TEXT, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "vehicles_user_id_idx" ON "vehicles"("user_id");
CREATE TABLE "vehicle_reminders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "vehicle_id" UUID NOT NULL, "kind" VARCHAR(32) NOT NULL,
  "due_at" TIMESTAMP(3) NOT NULL, "completed_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "vehicle_reminders_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "vehicle_reminders_vehicle_id_due_at_idx" ON "vehicle_reminders"("vehicle_id", "due_at");

CREATE TABLE "local_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "business_id" UUID, "city_id" UUID NOT NULL, "title" TEXT NOT NULL,
  "category" TEXT NOT NULL, "description" TEXT, "starts_at" TIMESTAMP(3) NOT NULL, "ends_at" TIMESTAMP(3), "address" TEXT, "organizer" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "local_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "local_events_city_id_starts_at_idx" ON "local_events"("city_id", "starts_at");

CREATE TABLE "community_groups" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "creator_id" UUID NOT NULL, "city_id" UUID, "name" TEXT NOT NULL, "description" TEXT,
  "is_public" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "community_groups_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "community_groups_city_id_is_public_idx" ON "community_groups"("city_id", "is_public");
CREATE TABLE "community_memberships" (
  "user_id" UUID NOT NULL, "group_id" UUID NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "community_memberships_pkey" PRIMARY KEY ("user_id", "group_id")
);
CREATE TABLE "community_posts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "group_id" UUID NOT NULL, "author_id" UUID NOT NULL, "body" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "community_posts_group_id_created_at_idx" ON "community_posts"("group_id", "created_at");

CREATE TABLE "membership_cards" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "level" VARCHAR(32) NOT NULL DEFAULT 'EXPLORER',
  "benefits" JSONB NOT NULL DEFAULT '[]', "valid_until" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "membership_cards_pkey" PRIMARY KEY ("id"), CONSTRAINT "membership_cards_user_id_key" UNIQUE ("user_id")
);
CREATE TABLE "user_module_preferences" (
  "user_id" UUID NOT NULL, "module" "SuperAppModuleKey" NOT NULL, "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "enabled" BOOLEAN NOT NULL DEFAULT true, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_module_preferences_pkey" PRIMARY KEY ("user_id", "module")
);

CREATE TABLE "travel_experiences" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "business_id" UUID, "city_id" UUID NOT NULL, "title" TEXT NOT NULL, "description" TEXT,
  "category" TEXT NOT NULL, "starts_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "travel_experiences_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "travel_experiences_city_id_category_idx" ON "travel_experiences"("city_id", "category");
CREATE TABLE "property_listings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "owner_id" UUID NOT NULL, "city_id" UUID NOT NULL, "title" TEXT NOT NULL, "description" TEXT,
  "price" DECIMAL(14,2), "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR', "listing_type" VARCHAR(32) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "property_listings_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "property_listings_city_id_listing_type_idx" ON "property_listings"("city_id", "listing_type");
CREATE TABLE "education_courses" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "business_id" UUID, "title" TEXT NOT NULL, "description" TEXT, "language" VARCHAR(10), "category" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "education_courses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "education_courses_category_idx" ON "education_courses"("category");

ALTER TABLE "health_profiles" ADD CONSTRAINT "health_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "health_reminders" ADD CONSTRAINT "health_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "health_reminders" ADD CONSTRAINT "health_reminders_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "health_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vehicle_reminders" ADD CONSTRAINT "vehicle_reminders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "local_events" ADD CONSTRAINT "local_events_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "local_events" ADD CONSTRAINT "local_events_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_groups" ADD CONSTRAINT "community_groups_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_groups" ADD CONSTRAINT "community_groups_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "membership_cards" ADD CONSTRAINT "membership_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_module_preferences" ADD CONSTRAINT "user_module_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "travel_experiences" ADD CONSTRAINT "travel_experiences_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "travel_experiences" ADD CONSTRAINT "travel_experiences_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_listings" ADD CONSTRAINT "property_listings_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "education_courses" ADD CONSTRAINT "education_courses_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
