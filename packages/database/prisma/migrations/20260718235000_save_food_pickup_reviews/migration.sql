ALTER TABLE "save_food_reservations"
  ADD COLUMN "pickup_code" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

CREATE UNIQUE INDEX "save_food_reservations_pickup_code_key"
  ON "save_food_reservations"("pickup_code");

CREATE TABLE "save_food_reviews" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reservation_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "save_food_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "save_food_reviews_reservation_id_key"
  ON "save_food_reviews"("reservation_id");
CREATE INDEX "save_food_reviews_user_id_created_at_idx"
  ON "save_food_reviews"("user_id", "created_at");

ALTER TABLE "save_food_reviews"
  ADD CONSTRAINT "save_food_reviews_reservation_id_fkey"
  FOREIGN KEY ("reservation_id") REFERENCES "save_food_reservations"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "save_food_reviews"
  ADD CONSTRAINT "save_food_reviews_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
