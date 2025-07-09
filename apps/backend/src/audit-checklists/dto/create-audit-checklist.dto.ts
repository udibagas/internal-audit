import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuditChecklistDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  auditId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  itemNumber?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referenceStandard?: string;

  @ApiProperty()
  @IsNumber()
  createdById: number;
}
