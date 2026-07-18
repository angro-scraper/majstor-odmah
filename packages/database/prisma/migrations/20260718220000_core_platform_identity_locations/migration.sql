-- Sprint 01/02: shared Balkan ID identity attributes and central user locations.
CREATE TYPE "UserType" AS ENUM ('CONSUMER', 'BUSINESS_OWNER', 'EMPLOYEE', 'ADMIN');

ALTER TABLE "users"
  ADD COLUMN "user_type" "UserType" NOT NULL DEFAULT 'CONSUMER',
  ADD COLUMN "phone_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "last_login_at" TIMESTAMP(3);

ALTER TABLE "profiles" ADD COLUMN "date_of_birth" TIMESTAMP(3);

CREATE TABLE "user_locations" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "city_id" UUID NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_locations_user_id_city_id_key" UNIQUE ("user_id", "city_id")
);

CREATE INDEX "user_locations_user_id_is_primary_idx" ON "user_locations"("user_id", "is_primary");

ALTER TABLE "user_locations"
  ADD CONSTRAINT "user_locations_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_locations"
  ADD CONSTRAINT "user_locations_city_id_fkey"
  FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
