CREATE TABLE "contact_inquiries" (
  "id" UUID NOT NULL,
  "user_id" UUID,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "contact_inquiries_email_created_at_idx" ON "contact_inquiries"("email", "created_at");
CREATE INDEX "contact_inquiries_status_created_at_idx" ON "contact_inquiries"("status", "created_at");
ALTER TABLE "contact_inquiries" ADD CONSTRAINT "contact_inquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
