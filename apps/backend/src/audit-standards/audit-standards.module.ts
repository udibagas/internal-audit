import { Module } from "@nestjs/common";
import { AuditStandardsService } from "./audit-standards.service";
import { AuditStandardsController } from "./audit-standards.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AuditStandardsController],
  providers: [AuditStandardsService],
  exports: [AuditStandardsService],
})
export class AuditStandardsModule {}
