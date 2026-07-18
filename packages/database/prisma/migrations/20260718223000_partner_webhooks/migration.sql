CREATE TYPE "WebhookStatus" AS ENUM ('ACTIVE', 'PAUSED', 'DISABLED');
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');

CREATE TABLE "partner_webhook_subscriptions" (
  "id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "endpoint_url" TEXT NOT NULL,
  "event_types" JSONB NOT NULL DEFAULT '[]',
  "signing_secret_encrypted" TEXT NOT NULL,
  "status" "WebhookStatus" NOT NULL DEFAULT 'ACTIVE',
  "last_failure_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "partner_webhook_subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "partner_webhook_deliveries" (
  "id" UUID NOT NULL,
  "subscription_id" UUID NOT NULL,
  "event_type" TEXT NOT NULL,
  "payload" JSONB NOT NULL DEFAULT '{}',
  "status" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "response_status" INTEGER,
  "error_code" TEXT,
  "delivered_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "partner_webhook_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "partner_webhook_subscriptions_partner_id_status_idx" ON "partner_webhook_subscriptions"("partner_id", "status");
CREATE INDEX "partner_webhook_deliveries_subscription_id_status_created_at_idx" ON "partner_webhook_deliveries"("subscription_id", "status", "created_at");
ALTER TABLE "partner_webhook_subscriptions" ADD CONSTRAINT "partner_webhook_subscriptions_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "partner_webhook_deliveries" ADD CONSTRAINT "partner_webhook_deliveries_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "partner_webhook_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
