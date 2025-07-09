import { Module } from "@nestjs/common";
import { AuditAreasService } from "./audit-areas.service";
import { AuditAreasController } from "./audit-areas.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AuditAreasController],
  providers: [AuditAreasService],
  exports: [AuditAreasService],
})
export class AuditAreasModule {}
