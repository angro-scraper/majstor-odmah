-- Partner ecosystem foundation: profiles, controlled API keys, integrations and audit-ready usage tracking.
CREATE TYPE "PartnerCategory" AS ENUM ('FINANCIAL', 'TELECOM', 'RETAIL', 'FOOD', 'CITY_GOVERNMENT', 'EDUCATION', 'LOGISTICS', 'TECHNOLOGY', 'OTHER');
CREATE TYPE "PartnerLevel" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'ENTERPRISE');
CREATE TYPE "PartnerStatus" AS ENUM ('PROSPECT', 'PILOT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');
CREATE TYPE "PartnerIntegrationStatus" AS ENUM ('PLANNED', 'PILOT', 'ACTIVE', 'PAUSED', 'RETIRED');

CREATE TABLE "partners" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" "PartnerCategory" NOT NULL,
  "level" "PartnerLevel" NOT NULL DEFAULT 'BRONZE',
  "status" "PartnerStatus" NOT NULL DEFAULT 'PROSPECT',
  "contact_name" TEXT,
  "contact_email" TEXT,
  "website" TEXT,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_api_keys" (
  "id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "label" TEXT NOT NULL,
  "key_prefix" TEXT NOT NULL,
  "key_hash" TEXT NOT NULL,
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "expires_at" TIMESTAMP(3),
  "last_used_at" TIMESTAMP(3),
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "partner_api_keys_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_integrations" (
  "id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "integration_type" TEXT NOT NULL,
  "status" "PartnerIntegrationStatus" NOT NULL DEFAULT 'PLANNED',
  "scopes" JSONB NOT NULL DEFAULT '[]',
  "configuration" JSONB NOT NULL DEFAULT '{}',
  "started_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "partner_integrations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_api_requests" (
  "id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "api_key_id" UUID,
  "endpoint" TEXT NOT NULL,
  "status_code" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "partner_api_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "partners_slug_key" ON "partners"("slug");
CREATE UNIQUE INDEX "partner_api_keys_key_hash_key" ON "partner_api_keys"("key_hash");
CREATE INDEX "partners_status_level_idx" ON "partners"("status", "level");
CREATE INDEX "partners_category_status_idx" ON "partners"("category", "status");
CREATE INDEX "partner_api_keys_partner_id_revoked_at_idx" ON "partner_api_keys"("partner_id", "revoked_at");
CREATE INDEX "partner_integrations_partner_id_status_idx" ON "partner_integrations"("partner_id", "status");
CREATE INDEX "partner_api_requests_partner_id_created_at_idx" ON "partner_api_requests"("partner_id", "created_at");

ALTER TABLE "partner_api_keys" ADD CONSTRAINT "partner_api_keys_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "partner_integrations" ADD CONSTRAINT "partner_integrations_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "partner_api_requests" ADD CONSTRAINT "partner_api_requests_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "partner_api_requests" ADD CONSTRAINT "partner_api_requests_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "partner_api_keys"("id") ON DELETE SET NULL ON UPDATE CASCADE;
