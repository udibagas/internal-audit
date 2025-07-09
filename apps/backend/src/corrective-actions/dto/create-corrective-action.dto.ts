import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCorrectiveActionDto {
  @ApiProperty()
  @IsNumber()
  findingId: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsNumber()
  assignedToId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  verificationRequired?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  verifiedById?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  verifiedDate?: string;
}
