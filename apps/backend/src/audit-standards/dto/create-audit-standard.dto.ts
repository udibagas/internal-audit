import { IsString, IsOptional, IsBoolean, IsDateString } from "class-validator";

export class CreateAuditStandardDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
