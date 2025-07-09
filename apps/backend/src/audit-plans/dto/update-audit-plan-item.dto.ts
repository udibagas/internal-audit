import { PartialType } from "@nestjs/swagger";
import { CreateAuditPlanItemDto } from "./create-audit-plan-item.dto";

export class UpdateAuditPlanItemDto extends PartialType(
  CreateAuditPlanItemDto
) {}
