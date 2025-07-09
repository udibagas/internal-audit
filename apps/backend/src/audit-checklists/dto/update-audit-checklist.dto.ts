import { PartialType } from "@nestjs/swagger";
import { CreateAuditChecklistDto } from "./create-audit-checklist.dto";

export class UpdateAuditChecklistDto extends PartialType(
  CreateAuditChecklistDto
) {}
