import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { DepartmentsModule } from "./departments/departments.module";
import { AuditStandardsModule } from "./audit-standards/audit-standards.module";
import { AuditsModule } from "./audits/audits.module";
import { FindingsModule } from "./findings/findings.module";
import { DocumentsModule } from "./documents/documents.module";
import { CorrectiveActionsModule } from "./corrective-actions/corrective-actions.module";
import { AuditAreasModule } from "./audit-areas/audit-areas.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    AuditAreasModule,
    AuditStandardsModule,
    AuditsModule,
    FindingsModule,
    DocumentsModule,
    CorrectiveActionsModule,
  ],
})
export class AppModule {}
