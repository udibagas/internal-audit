import { PartialType } from "@nestjs/swagger";
import { CreateAuditAreaDto } from "./create-audit-area.dto";

export class UpdateAuditAreaDto extends PartialType(CreateAuditAreaDto) {}
