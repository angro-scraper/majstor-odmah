import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSubjectRequestStatus, LegalDocumentStatus, LegalDocumentType, Prisma } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { AcceptConsentDto, CreateDataRequestDto, CreateLegalDocumentDto, ResolveDataRequestDto } from "./compliance.dto";

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async latestPublished(typeValue: string, locale = "sr") {
    const type = this.documentType(typeValue);
    const document = await this.prisma.legalDocument.findFirst({
      where: { type, locale, status: LegalDocumentStatus.PUBLISHED, deletedAt: null },
      select: { id: true, type: true, version: true, locale: true, title: true, content: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    if (!document) throw new NotFoundException("LEGAL_DOCUMENT_NOT_PUBLISHED");
    return document;
  }

  async consents(userId: string) {
    return this.prisma.userConsent.findMany({
      where: { userId }, include: { document: { select: { id: true, type: true, version: true, locale: true, title: true, status: true } } }, orderBy: { updatedAt: "desc" },
    });
  }

  async acceptConsent(userId: string, input: AcceptConsentDto) {
    const document = await this.prisma.legalDocument.findFirst({ where: { id: input.documentId, status: LegalDocumentStatus.PUBLISHED, deletedAt: null }, select: { id: true, type: true, version: true } });
    if (!document) throw new NotFoundException("LEGAL_DOCUMENT_NOT_PUBLISHED");
    const consent = await this.prisma.userConsent.upsert({
      where: { userId_documentId: { userId, documentId: document.id } },
      create: { userId, documentId: document.id, source: input.source, acceptedAt: new Date() },
      update: { source: input.source, acceptedAt: new Date(), withdrawnAt: null },
    });
    await this.audit(userId, "LEGAL_CONSENT_ACCEPTED", "legal_document", document.id, { type: document.type, version: document.version });
    return consent;
  }

  async withdrawConsent(userId: string, documentId: string) {
    const consent = await this.prisma.userConsent.findUnique({ where: { userId_documentId: { userId, documentId } } });
    if (!consent) throw new NotFoundException("CONSENT_NOT_FOUND");
    const updated = await this.prisma.userConsent.update({ where: { id: consent.id }, data: { withdrawnAt: new Date() } });
    await this.audit(userId, "LEGAL_CONSENT_WITHDRAWN", "legal_document", documentId, {});
    return updated;
  }

  async dataExport(userId: string) {
    const [user, favorites, reviews, events, searches, consents, requests] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, email: true, phone: true, status: true, createdAt: true, updatedAt: true,
          profile: { include: { country: { select: { code: true, name: true } }, city: { select: { name: true } } } },
          roles: { include: { role: { select: { name: true } } } },
          businesses: { where: { deletedAt: null }, select: { id: true, name: true, slug: true, status: true, createdAt: true } },
        },
      }),
      this.prisma.favorite.findMany({ where: { userId, deletedAt: null }, select: { createdAt: true, business: { select: { id: true, name: true } }, offer: { select: { id: true, title: true } } } }),
      this.prisma.review.findMany({ where: { userId, deletedAt: null }, select: { rating: true, comment: true, status: true, createdAt: true, business: { select: { id: true, name: true } } } }),
      this.prisma.event.findMany({ where: { userId, deletedAt: null }, select: { eventType: true, metadata: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 10000 }),
      this.prisma.searchQuery.findMany({ where: { userId, deletedAt: null }, select: { query: true, location: true, resultsCount: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 10000 }),
      this.prisma.userConsent.findMany({ where: { userId }, select: { acceptedAt: true, withdrawnAt: true, source: true, document: { select: { type: true, version: true, locale: true } } } }),
      this.prisma.dataSubjectRequest.findMany({ where: { userId }, select: { type: true, status: true, note: true, resolutionNote: true, createdAt: true, completedAt: true } }),
    ]);
    if (!user) throw new NotFoundException("USER_NOT_FOUND");
    await this.audit(userId, "DATA_EXPORT_GENERATED", "user", userId, {});
    return { generatedAt: new Date(), format: "json", data: { account: user, favorites, reviews, events, searches, consents, dataSubjectRequests: requests } };
  }

  async createDataRequest(userId: string, input: CreateDataRequestDto) {
    const existing = await this.prisma.dataSubjectRequest.findFirst({ where: { userId, type: input.type, status: { in: [DataSubjectRequestStatus.PENDING, DataSubjectRequestStatus.IN_REVIEW] } }, orderBy: { createdAt: "desc" } });
    if (existing) return existing;
    const request = await this.prisma.dataSubjectRequest.create({ data: { userId, type: input.type, note: input.note?.trim() } });
    await this.audit(userId, "DATA_SUBJECT_REQUEST_CREATED", "data_subject_request", request.id, { type: input.type });
    return request;
  }

  async listDocuments() {
    return this.prisma.legalDocument.findMany({ where: { deletedAt: null }, select: { id: true, type: true, version: true, locale: true, title: true, status: true, publishedAt: true, createdAt: true, updatedAt: true }, orderBy: [{ type: "asc" }, { createdAt: "desc" }] });
  }

  async createDocument(actorUserId: string, input: CreateLegalDocumentDto) {
    const document = await this.prisma.legalDocument.create({ data: { ...input, locale: input.locale ?? "sr", version: input.version.trim(), title: input.title.trim(), content: input.content.trim() } });
    await this.audit(actorUserId, "LEGAL_DOCUMENT_DRAFT_CREATED", "legal_document", document.id, { type: document.type, version: document.version, locale: document.locale });
    return document;
  }

  async publishDocument(actorUserId: string, id: string) {
    const document = await this.prisma.legalDocument.findFirst({ where: { id, deletedAt: null } });
    if (!document) throw new NotFoundException("LEGAL_DOCUMENT_NOT_FOUND");
    const publishedAt = new Date();
    const published = await this.prisma.$transaction(async (tx) => {
      await tx.legalDocument.updateMany({ where: { type: document.type, locale: document.locale, status: LegalDocumentStatus.PUBLISHED, id: { not: id }, deletedAt: null }, data: { status: LegalDocumentStatus.ARCHIVED } });
      return tx.legalDocument.update({ where: { id }, data: { status: LegalDocumentStatus.PUBLISHED, publishedAt } });
    });
    await this.audit(actorUserId, "LEGAL_DOCUMENT_PUBLISHED", "legal_document", id, { type: published.type, version: published.version, locale: published.locale });
    return published;
  }

  async listDataRequests() {
    return this.prisma.dataSubjectRequest.findMany({
      include: { user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } } },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }], take: 250,
    });
  }

  async resolveDataRequest(actorUserId: string, id: string, input: ResolveDataRequestDto) {
    const request = await this.prisma.dataSubjectRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException("DATA_SUBJECT_REQUEST_NOT_FOUND");
    const completed = input.status === DataSubjectRequestStatus.COMPLETED;
    const updated = await this.prisma.dataSubjectRequest.update({ where: { id }, data: { status: input.status, resolutionNote: input.note?.trim(), reviewedById: actorUserId, completedAt: completed ? (input.completedAt ? new Date(input.completedAt) : new Date()) : null } });
    await this.audit(actorUserId, "DATA_SUBJECT_REQUEST_UPDATED", "data_subject_request", id, { status: input.status });
    return updated;
  }

  private documentType(value: string): LegalDocumentType {
    if (!Object.values(LegalDocumentType).includes(value as LegalDocumentType)) throw new BadRequestException("INVALID_LEGAL_DOCUMENT_TYPE");
    return value as LegalDocumentType;
  }

  private async audit(actorUserId: string, action: string, resourceType: string, resourceId: string, payload: Record<string, unknown>) {
    await this.prisma.auditLog.create({ data: { actorUserId, action, resourceType, resourceId, payload: payload as Prisma.InputJsonValue } });
  }
}
