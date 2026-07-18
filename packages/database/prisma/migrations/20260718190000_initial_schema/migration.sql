-- Generated from the reviewed Prisma schema with `prisma migrate diff --from-empty`.
CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING');
CREATE TYPE "BusinessStatus" AS ENUM ('DRAFT', 'PENDING', 'VERIFIED', 'BLOCKED');
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ContactType" AS ENUM ('PHONE', 'EMAIL', 'MESSAGE', 'LOCATION');
CREATE TYPE "NotificationType" AS ENUM ('IMPORTANT', 'RECOMMENDATION', 'PROMOTION', 'SYSTEM');
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'ARCHIVED');
CREATE TYPE "CategoryType" AS ENUM ('FOOD', 'RETAIL', 'SERVICES', 'EVENTS', 'HEALTH', 'OTHER');

CREATE TABLE "users" (
  "id" UUID NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "password_hash" TEXT NOT NULL,
  "status" "UserStatus" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "auth_sessions" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "refresh_token" TEXT NOT NULL, "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "profiles" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "first_name" TEXT, "last_name" TEXT, "avatar_url" TEXT,
  "country_id" UUID, "city_id" UUID, "preferences" JSONB NOT NULL DEFAULT '{}', "interests" JSONB NOT NULL DEFAULT '[]',
  "language" TEXT DEFAULT 'sr', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "countries" (
  "id" UUID NOT NULL, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "currency" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "cities" (
  "id" UUID NOT NULL, "country_id" UUID NOT NULL, "name" TEXT NOT NULL, "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "roles" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "permissions" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "user_roles" ("user_id" UUID NOT NULL, "role_id" UUID NOT NULL, CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id"));
CREATE TABLE "role_permissions" ("role_id" UUID NOT NULL, "permission_id" UUID NOT NULL, CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id"));
CREATE TABLE "businesses" (
  "id" UUID NOT NULL, "owner_id" UUID NOT NULL, "name" TEXT NOT NULL, "slug" TEXT, "description" TEXT,
  "logo_url" TEXT, "category_id" UUID, "phone" TEXT, "email" TEXT, "website" TEXT,
  "opening_hours" JSONB NOT NULL DEFAULT '{}', "status" "BusinessStatus" NOT NULL DEFAULT 'DRAFT',
  "verification_status" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "categories" (
  "id" UUID NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "icon" TEXT, "type" "CategoryType" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "offers" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "category_id" UUID, "title" TEXT NOT NULL, "description" TEXT,
  "image_url" TEXT, "price" DECIMAL(12,2), "discount_price" DECIMAL(12,2), "currency" TEXT NOT NULL DEFAULT 'RSD',
  "starts_at" TIMESTAMP(3), "expires_at" TIMESTAMP(3), "status" "OfferStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "favorites" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "business_id" UUID, "offer_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "reviews" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "business_id" UUID NOT NULL, "rating" INTEGER NOT NULL,
  "comment" TEXT, "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "services" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "price_range" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "business_images" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "url" TEXT NOT NULL, "type" TEXT, "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "business_images_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "events" (
  "id" UUID NOT NULL, "user_id" UUID, "business_id" UUID, "offer_id" UUID, "event_type" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "searches" (
  "id" UUID NOT NULL, "user_id" UUID, "query" TEXT NOT NULL, "location" TEXT, "results_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "searches_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "business_views" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "user_id" UUID, "source" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "business_views_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "contact_events" (
  "id" UUID NOT NULL, "user_id" UUID, "business_id" UUID NOT NULL, "type" "ContactType" NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contact_events_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "subscriptions" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "plan" TEXT NOT NULL, "status" TEXT NOT NULL,
  "started_at" TIMESTAMP(3) NOT NULL, "expires_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "embeddings" (
  "id" UUID NOT NULL, "entity_type" TEXT NOT NULL, "entity_id" TEXT NOT NULL, "vector" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3), CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "business_locations" (
  "id" UUID NOT NULL, "business_id" UUID NOT NULL, "city_id" UUID NOT NULL, "address" TEXT,
  "latitude" DOUBLE PRECISION, "longitude" DOUBLE PRECISION, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "business_locations_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL, "actor_user_id" UUID, "action" TEXT NOT NULL, "resource_type" TEXT NOT NULL, "resource_id" TEXT,
  "payload" JSONB NOT NULL DEFAULT '{}', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "files" (
  "id" UUID NOT NULL, "owner_user_id" UUID NOT NULL, "storage_key" TEXT NOT NULL, "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL, "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "notifications" (
  "id" UUID NOT NULL, "user_id" UUID NOT NULL, "type" "NotificationType" NOT NULL, "title" TEXT NOT NULL,
  "message" TEXT NOT NULL, "read_at" TIMESTAMP(3), "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX "auth_sessions_refresh_token_key" ON "auth_sessions"("refresh_token");
CREATE INDEX "auth_sessions_user_id_expires_at_idx" ON "auth_sessions"("user_id", "expires_at");
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");
CREATE UNIQUE INDEX "cities_country_id_name_key" ON "cities"("country_id", "name");
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");
CREATE UNIQUE INDEX "businesses_slug_key" ON "businesses"("slug");
CREATE INDEX "businesses_category_id_status_idx" ON "businesses"("category_id", "status");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE INDEX "categories_type_idx" ON "categories"("type");
CREATE INDEX "offers_business_id_status_idx" ON "offers"("business_id", "status");
CREATE INDEX "offers_expires_at_status_idx" ON "offers"("expires_at", "status");
CREATE INDEX "favorites_user_id_created_at_idx" ON "favorites"("user_id", "created_at");
CREATE INDEX "reviews_business_id_created_at_idx" ON "reviews"("business_id", "created_at");
CREATE UNIQUE INDEX "reviews_user_id_business_id_key" ON "reviews"("user_id", "business_id");
CREATE INDEX "services_business_id_idx" ON "services"("business_id");
CREATE INDEX "business_images_business_id_order_index_idx" ON "business_images"("business_id", "order_index");
CREATE INDEX "events_user_id_created_at_idx" ON "events"("user_id", "created_at");
CREATE INDEX "events_business_id_created_at_idx" ON "events"("business_id", "created_at");
CREATE INDEX "events_event_type_created_at_idx" ON "events"("event_type", "created_at");
CREATE INDEX "searches_user_id_created_at_idx" ON "searches"("user_id", "created_at");
CREATE INDEX "business_views_business_id_created_at_idx" ON "business_views"("business_id", "created_at");
CREATE INDEX "contact_events_business_id_created_at_idx" ON "contact_events"("business_id", "created_at");
CREATE INDEX "subscriptions_business_id_status_idx" ON "subscriptions"("business_id", "status");
CREATE UNIQUE INDEX "embeddings_entity_type_entity_id_key" ON "embeddings"("entity_type", "entity_id");
CREATE UNIQUE INDEX "files_storage_key_key" ON "files"("storage_key");

ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "offers" ADD CONSTRAINT "offers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "offers" ADD CONSTRAINT "offers_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "services" ADD CONSTRAINT "services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "business_images" ADD CONSTRAINT "business_images_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "searches" ADD CONSTRAINT "searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "business_views" ADD CONSTRAINT "business_views_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contact_events" ADD CONSTRAINT "contact_events_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "business_locations" ADD CONSTRAINT "business_locations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "files" ADD CONSTRAINT "files_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
