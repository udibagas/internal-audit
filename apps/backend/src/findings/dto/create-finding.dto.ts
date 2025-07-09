import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFindingDto {
  @ApiProperty()
  @IsNumber()
  auditId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  checklistId?: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsNumber()
  identifiedById: number;

  @ApiProperty()
  @IsDateString()
  identifiedDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  responsiblePartyId?: number;
}
