import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuditPlanItemDto {
  @ApiProperty()
  @IsNumber()
  planId: number;

  @ApiProperty()
  @IsNumber()
  areaId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  standardId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  auditFrequency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  assignedAuditorId?: number;
}
