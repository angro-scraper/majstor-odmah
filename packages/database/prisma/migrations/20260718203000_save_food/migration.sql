CREATE TYPE "SaveFoodPackageStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SOLD_OUT', 'EXPIRED', 'ARCHIVED');
CREATE TYPE "SaveFoodReservationStatus" AS ENUM ('RESERVED', 'PICKED_UP', 'CANCELLED', 'EXPIRED');

CREATE TABLE "save_food_packages" (
  "id" UUID NOT NULL,
  "business_id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "image_url" TEXT,
  "original_price" DECIMAL(12,2),
  "pickup_price" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'RSD',
  "quantity_available" INTEGER NOT NULL DEFAULT 0,
  "quantity_total" INTEGER NOT NULL,
  "pickup_start_at" TIMESTAMP(3) NOT NULL,
  "pickup_end_at" TIMESTAMP(3) NOT NULL,
  "status" "SaveFoodPackageStatus" NOT NULL DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "save_food_packages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "save_food_reservations" (
  "id" UUID NOT NULL,
  "package_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "status" "SaveFoodReservationStatus" NOT NULL DEFAULT 'RESERVED',
  "reserved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cancelled_at" TIMESTAMP(3),
  "picked_up_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "save_food_reservations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "save_food_packages_business_id_status_idx" ON "save_food_packages"("business_id", "status");
CREATE INDEX "save_food_packages_status_pickup_end_at_idx" ON "save_food_packages"("status", "pickup_end_at");
CREATE INDEX "save_food_reservations_user_id_status_idx" ON "save_food_reservations"("user_id", "status");
CREATE INDEX "save_food_reservations_package_id_status_idx" ON "save_food_reservations"("package_id", "status");
ALTER TABLE "save_food_packages" ADD CONSTRAINT "save_food_packages_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "save_food_reservations" ADD CONSTRAINT "save_food_reservations_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "save_food_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "save_food_reservations" ADD CONSTRAINT "save_food_reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
