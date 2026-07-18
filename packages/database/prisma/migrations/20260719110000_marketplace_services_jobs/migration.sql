CREATE TYPE "ServiceProviderStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'SUSPENDED');
CREATE TYPE "ServiceRequestStatus" AS ENUM ('OPEN', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'SEASONAL', 'FREELANCE');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED');
CREATE TYPE "JobApplicationStatus" AS ENUM ('SUBMITTED', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'REJECTED', 'HIRED', 'WITHDRAWN');
CREATE TYPE "MarketplaceItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RESERVED', 'SOLD', 'EXPIRED', 'ARCHIVED');
CREATE TYPE "ConversationType" AS ENUM ('SERVICE', 'JOB', 'MARKETPLACE', 'GENERAL');
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'READ', 'DELETED');
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

CREATE TABLE "service_categories" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "parent_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");
CREATE INDEX "service_categories_parent_id_idx" ON "service_categories"("parent_id");
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "service_providers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "business_id" UUID, "description" TEXT, "experience_years" INTEGER NOT NULL DEFAULT 0,
  "price_from" DECIMAL(12,2), "currency" TEXT NOT NULL DEFAULT 'RSD', "availability" JSONB NOT NULL DEFAULT '{}', "location" TEXT,
  "status" "ServiceProviderStatus" NOT NULL DEFAULT 'DRAFT', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "service_providers_user_id_key" ON "service_providers"("user_id");
CREATE UNIQUE INDEX "service_providers_business_id_key" ON "service_providers"("business_id");
CREATE INDEX "service_providers_status_location_idx" ON "service_providers"("status", "location");
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_providers" ADD CONSTRAINT "service_providers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "service_provider_categories" (
  "provider_id" UUID NOT NULL, "category_id" UUID NOT NULL, CONSTRAINT "service_provider_categories_pkey" PRIMARY KEY ("provider_id", "category_id")
);
ALTER TABLE "service_provider_categories" ADD CONSTRAINT "service_provider_categories_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_provider_categories" ADD CONSTRAINT "service_provider_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "provider_services" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "provider_id" UUID NOT NULL, "category_id" UUID NOT NULL, "name" TEXT NOT NULL, "description" TEXT,
  "price_from" DECIMAL(12,2), "currency" TEXT NOT NULL DEFAULT 'RSD', "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "provider_services_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "provider_services_category_id_is_active_idx" ON "provider_services"("category_id", "is_active");
CREATE INDEX "provider_services_provider_id_is_active_idx" ON "provider_services"("provider_id", "is_active");
ALTER TABLE "provider_services" ADD CONSTRAINT "provider_services_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "provider_services" ADD CONSTRAINT "provider_services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "service_requests" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "category_id" UUID NOT NULL, "provider_id" UUID, "description" TEXT NOT NULL,
  "location" TEXT, "budget" DECIMAL(12,2), "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "service_requests_category_id_status_created_at_idx" ON "service_requests"("category_id", "status", "created_at");
CREATE INDEX "service_requests_provider_id_status_idx" ON "service_requests"("provider_id", "status");
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "bookings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "service_id" UUID NOT NULL, "customer_id" UUID NOT NULL, "provider_id" UUID NOT NULL,
  "scheduled_at" TIMESTAMP(3) NOT NULL, "location" TEXT, "agreed_price" DECIMAL(12,2), "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "cancelled_at" TIMESTAMP(3),
  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "bookings_provider_id_scheduled_at_idx" ON "bookings"("provider_id", "scheduled_at");
CREATE INDEX "bookings_customer_id_scheduled_at_idx" ON "bookings"("customer_id", "scheduled_at");
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "provider_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "jobs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "business_id" UUID NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "category" TEXT NOT NULL,
  "location" TEXT, "salary_min" DECIMAL(12,2), "salary_max" DECIMAL(12,2), "currency" TEXT NOT NULL DEFAULT 'EUR', "type" "JobType" NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'DRAFT', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "jobs_status_category_created_at_idx" ON "jobs"("status", "category", "created_at");
CREATE INDEX "jobs_business_id_status_idx" ON "jobs"("business_id", "status");
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "job_applications" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "job_id" UUID NOT NULL, "user_id" UUID NOT NULL, "message" TEXT, "resume_url" TEXT,
  "status" "JobApplicationStatus" NOT NULL DEFAULT 'SUBMITTED', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "job_applications_job_id_user_id_key" ON "job_applications"("job_id", "user_id");
CREATE INDEX "job_applications_user_id_created_at_idx" ON "job_applications"("user_id", "created_at");
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "marketplace_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "seller_id" UUID NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
  "price" DECIMAL(12,2) NOT NULL, "currency" TEXT NOT NULL DEFAULT 'RSD', "category" TEXT NOT NULL, "location" TEXT,
  "image_urls" JSONB NOT NULL DEFAULT '[]', "status" "MarketplaceItemStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3),
  CONSTRAINT "marketplace_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "marketplace_items_status_category_created_at_idx" ON "marketplace_items"("status", "category", "created_at");
CREATE INDEX "marketplace_items_seller_id_status_idx" ON "marketplace_items"("seller_id", "status");
ALTER TABLE "marketplace_items" ADD CONSTRAINT "marketplace_items_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "conversations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "type" "ConversationType" NOT NULL DEFAULT 'GENERAL', "reference_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP(3) NOT NULL, CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "conversations_type_reference_id_idx" ON "conversations"("type", "reference_id");

CREATE TABLE "conversation_participants" (
  "conversation_id" UUID NOT NULL, "user_id" UUID NOT NULL, "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "last_read_at" TIMESTAMP(3),
  CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id", "user_id")
);
CREATE INDEX "conversation_participants_user_id_joined_at_idx" ON "conversation_participants"("user_id", "joined_at");
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "messages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "conversation_id" UUID NOT NULL, "sender_id" UUID NOT NULL, "content" TEXT NOT NULL,
  "attachments" JSONB NOT NULL DEFAULT '[]', "status" "MessageStatus" NOT NULL DEFAULT 'SENT', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "deleted_at" TIMESTAMP(3), CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "reports" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "target_type" TEXT NOT NULL, "target_id" TEXT NOT NULL, "reason" TEXT NOT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL, "resolved_at" TIMESTAMP(3), CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "reports_target_type_target_id_status_idx" ON "reports"("target_type", "target_id", "status");
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
