import { Module } from "@nestjs/common";
import { ComplianceAdminController, ComplianceController, LegalDocumentsController } from "./compliance.controller";
import { ComplianceService } from "./compliance.service";

@Module({ controllers: [ComplianceController, ComplianceAdminController, LegalDocumentsController], providers: [ComplianceService] })
export class ComplianceModule {}
