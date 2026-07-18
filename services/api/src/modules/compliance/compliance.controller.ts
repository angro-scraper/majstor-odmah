import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AdminGuard, AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { AcceptConsentDto, CreateDataRequestDto, CreateLegalDocumentDto, ResolveDataRequestDto } from "./compliance.dto";
import { ComplianceService } from "./compliance.service";

@Controller("legal")
export class LegalDocumentsController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get(":type")
  async latest(@Param("type") type: string, @Query("locale") locale?: string) { return ok(await this.compliance.latestPublished(type, locale)); }
}

@Controller("compliance")
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get("consents")
  async consents(@CurrentUser() user: AuthenticatedUser) { return ok(await this.compliance.consents(user.id)); }

  @Post("consents")
  async acceptConsent(@CurrentUser() user: AuthenticatedUser, @Body() input: AcceptConsentDto) { return ok(await this.compliance.acceptConsent(user.id, input), "Consent recorded"); }

  @Delete("consents/:documentId")
  async withdrawConsent(@CurrentUser() user: AuthenticatedUser, @Param("documentId") documentId: string) { return ok(await this.compliance.withdrawConsent(user.id, documentId), "Consent withdrawn"); }

  @Get("data-export")
  async dataExport(@CurrentUser() user: AuthenticatedUser) { return ok(await this.compliance.dataExport(user.id)); }

  @Post("data-requests")
  async createDataRequest(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateDataRequestDto) { return ok(await this.compliance.createDataRequest(user.id, input), "Data-subject request submitted"); }
}

@Controller("admin/compliance")
@UseGuards(JwtAuthGuard, AdminGuard)
export class ComplianceAdminController {
  constructor(private readonly compliance: ComplianceService) {}

  @Get("documents")
  async documents() { return ok(await this.compliance.listDocuments()); }

  @Post("documents")
  async createDocument(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateLegalDocumentDto) { return ok(await this.compliance.createDocument(user.id, input), "Legal document created as draft"); }

  @Post("documents/:id/publish")
  async publishDocument(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return ok(await this.compliance.publishDocument(user.id, id), "Legal document published"); }

  @Get("data-requests")
  async dataRequests() { return ok(await this.compliance.listDataRequests()); }

  @Patch("data-requests/:id")
  async resolveDataRequest(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: ResolveDataRequestDto) { return ok(await this.compliance.resolveDataRequest(user.id, id, input)); }
}
