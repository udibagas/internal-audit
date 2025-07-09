import { IsString, IsOptional, IsNumber, IsDateString } from "class-validator";

export class CreateAuditDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  planItemId?: number;

  @IsNumber()
  areaId: number;

  @IsNumber()
  @IsOptional()
  standardId?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  leadAuditorId: number;
}
