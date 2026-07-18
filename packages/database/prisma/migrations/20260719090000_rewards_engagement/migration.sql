CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');
CREATE TYPE "RewardEventType" AS ENUM ('SAVE_FOOD_RESERVED', 'SAVE_FOOD_PICKED_UP', 'SAVE_FOOD_REVIEWED', 'DEAL_SAVED', 'DEAL_SHARED', 'BUSINESS_FOLLOWED', 'REVIEW_CREATED', 'FRIEND_INVITED', 'REFERRAL_COMPLETED', 'DAILY_CHECK_IN', 'CHALLENGE_COMPLETED');
CREATE TYPE "RewardLevel" AS ENUM ('EXPLORER', 'LOCAL_HERO', 'BALKAN_INSIDER', 'BALKAN_AMBASSADOR');
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

ALTER TABLE "notifications"
  ADD COLUMN "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN "action_url" TEXT,
  ADD COLUMN "module" TEXT;

CREATE TABLE "reward_balances" (
  "user_id" UUID NOT NULL,
  "total_points" INTEGER NOT NULL DEFAULT 0,
  "level" "RewardLevel" NOT NULL DEFAULT 'EXPLORER',
  "referral_code" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "reward_balances_pkey" PRIMARY KEY ("user_id")
);
CREATE UNIQUE INDEX "reward_balances_referral_code_key" ON "reward_balances"("referral_code");
CREATE INDEX "reward_balances_level_total_points_idx" ON "reward_balances"("level", "total_points");
ALTER TABLE "reward_balances" ADD CONSTRAINT "reward_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "reward_transactions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "event_type" "RewardEventType" NOT NULL,
  "points" INTEGER NOT NULL,
  "reference_id" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reward_transactions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "reward_transactions_user_id_event_type_reference_id_key" ON "reward_transactions"("user_id", "event_type", "reference_id");
CREATE INDEX "reward_transactions_user_id_created_at_idx" ON "reward_transactions"("user_id", "created_at");
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "rewards_catalog" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "business_id" UUID,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "image_url" TEXT,
  "points_required" INTEGER NOT NULL,
  "available_quantity" INTEGER,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "rewards_catalog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "rewards_catalog_is_active_points_required_idx" ON "rewards_catalog"("is_active", "points_required");
ALTER TABLE "rewards_catalog" ADD CONSTRAINT "rewards_catalog_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "referrals" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "inviter_id" UUID NOT NULL,
  "invited_user_id" UUID,
  "invited_email" TEXT,
  "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "referrals_invited_user_id_key" ON "referrals"("invited_user_id");
CREATE UNIQUE INDEX "referrals_inviter_id_invited_email_key" ON "referrals"("inviter_id", "invited_email");
CREATE INDEX "referrals_inviter_id_status_idx" ON "referrals"("inviter_id", "status");
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "user_interests" (
  "user_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_interests_pkey" PRIMARY KEY ("user_id", "category_id")
);
CREATE INDEX "user_interests_category_id_score_idx" ON "user_interests"("category_id", "score");
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "challenges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "goal" INTEGER NOT NULL,
  "reward_points" INTEGER NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "challenges_is_active_end_date_idx" ON "challenges"("is_active", "end_date");

CREATE TABLE "challenge_participations" (
  "user_id" UUID NOT NULL,
  "challenge_id" UUID NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "challenge_participations_pkey" PRIMARY KEY ("user_id", "challenge_id")
);
ALTER TABLE "challenge_participations" ADD CONSTRAINT "challenge_participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "challenge_participations" ADD CONSTRAINT "challenge_participations_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
