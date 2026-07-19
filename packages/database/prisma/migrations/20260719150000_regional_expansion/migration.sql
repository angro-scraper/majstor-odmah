-- Balkan.works regional expansion foundation.
-- Keeps country configuration, localization metadata and delegated admin scopes
-- normalized instead of forking the product by market.

ALTER TABLE "countries"
  ALTER COLUMN "code" TYPE VARCHAR(2),
  ALTER COLUMN "currency" TYPE VARCHAR(3),
  ADD COLUMN "default_language" VARCHAR(10) NOT NULL DEFAULT 'sr',
  ADD COLUMN "timezone" VARCHAR(64) NOT NULL DEFAULT 'Europe/Belgrade',
  ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

CREATE TYPE "AdminScopeLevel" AS ENUM ('COUNTRY', 'CITY');

CREATE TABLE "currencies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" VARCHAR(3) NOT NULL,
  "symbol" VARCHAR(8) NOT NULL,
  "exchange_rate" DECIMAL(18,6) NOT NULL DEFAULT 1,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

CREATE TABLE "translations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "key" VARCHAR(160) NOT NULL,
  "language" VARCHAR(10) NOT NULL,
  "value" TEXT NOT NULL,
  "country_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "translations_key_language_country_id_key" ON "translations"("key", "language", "country_id");
CREATE INDEX "translations_language_country_id_idx" ON "translations"("language", "country_id");
ALTER TABLE "translations" ADD CONSTRAINT "translations_country_id_fkey"
  FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "admin_scopes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "level" "AdminScopeLevel" NOT NULL,
  "country_id" UUID,
  "city_id" UUID,
  "assigned_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "admin_scopes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "admin_scopes_user_id_level_idx" ON "admin_scopes"("user_id", "level");
CREATE INDEX "admin_scopes_country_id_level_idx" ON "admin_scopes"("country_id", "level");
CREATE INDEX "admin_scopes_city_id_level_idx" ON "admin_scopes"("city_id", "level");
ALTER TABLE "admin_scopes" ADD CONSTRAINT "admin_scopes_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_scopes" ADD CONSTRAINT "admin_scopes_country_id_fkey"
  FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_scopes" ADD CONSTRAINT "admin_scopes_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
