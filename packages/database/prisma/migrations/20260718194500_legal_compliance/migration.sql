-- Legal and privacy compliance foundation: versioned documents, consent evidence and data-subject request workflow.
CREATE TYPE "LegalDocumentType" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'COOKIE_POLICY', 'BUSINESS_TERMS', 'PARTNER_TERMS', 'CONTENT_POLICY', 'REVIEW_POLICY');
CREATE TYPE "LegalDocumentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "DataSubjectRequestType" AS ENUM ('EXPORT', 'ERASURE', 'CORRECTION');
CREATE TYPE "DataSubjectRequestStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED', 'REJECTED', 'CANCELLED');

CREATE TABLE "legal_documents" (
  "id" UUID NOT NULL,
  "type" "LegalDocumentType" NOT NULL,
  "version" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'sr',
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" "LegalDocumentStatus" NOT NULL DEFAULT 'DRAFT',
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_consents" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "document_id" UUID NOT NULL,
  "source" TEXT,
  "accepted_at" TIMESTAMP(3),
  "withdrawn_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "data_subject_requests" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "type" "DataSubjectRequestType" NOT NULL,
  "status" "DataSubjectRequestStatus" NOT NULL DEFAULT 'PENDING',
  "note" TEXT,
  "resolution_note" TEXT,
  "completed_at" TIMESTAMP(3),
  "reviewed_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "data_subject_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "legal_documents_type_version_locale_key" ON "legal_documents"("type", "version", "locale");
CREATE UNIQUE INDEX "user_consents_user_id_document_id_key" ON "user_consents"("user_id", "document_id");
CREATE INDEX "legal_documents_type_locale_status_idx" ON "legal_documents"("type", "locale", "status");
CREATE INDEX "user_consents_user_id_accepted_at_idx" ON "user_consents"("user_id", "accepted_at");
CREATE INDEX "data_subject_requests_user_id_status_idx" ON "data_subject_requests"("user_id", "status");
CREATE INDEX "data_subject_requests_status_created_at_idx" ON "data_subject_requests"("status", "created_at");

ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "legal_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "data_subject_requests" ADD CONSTRAINT "data_subject_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
