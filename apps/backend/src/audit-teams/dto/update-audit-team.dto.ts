import { PartialType } from "@nestjs/swagger";
import { CreateAuditTeamDto } from "./create-audit-team.dto";

export class UpdateAuditTeamDto extends PartialType(CreateAuditTeamDto) {}
