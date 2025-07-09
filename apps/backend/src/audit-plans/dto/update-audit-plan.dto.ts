import { PartialType } from "@nestjs/swagger";
import { CreateAuditPlanDto } from "./create-audit-plan.dto";
import { IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAuditPlanDto extends PartialType(CreateAuditPlanDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  approvedById?: number;
}
