import { PartialType } from "@nestjs/mapped-types";
import { CreateAuditStandardDto } from "./create-audit-standard.dto";

export class UpdateAuditStandardDto extends PartialType(
  CreateAuditStandardDto
) {}
