import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  relatedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  relatedId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  uploadedById: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  findingId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  correctiveActionId?: number;
}
