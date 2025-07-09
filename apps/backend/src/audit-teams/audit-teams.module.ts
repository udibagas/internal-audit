import { Module } from "@nestjs/common";
import { AuditTeamsService } from "./audit-teams.service";
import { AuditTeamsController } from "./audit-teams.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AuditTeamsController],
  providers: [AuditTeamsService],
  exports: [AuditTeamsService],
})
export class AuditTeamsModule {}
