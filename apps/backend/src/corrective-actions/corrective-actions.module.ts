import { Module } from "@nestjs/common";
import { CorrectiveActionsController } from "./corrective-actions.controller";
import { CorrectiveActionsService } from "./corrective-actions.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService, PrismaService],
  exports: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
