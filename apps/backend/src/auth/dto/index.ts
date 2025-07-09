import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin" })
  @IsString()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: "john.doe" })
  @IsString()
  name: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}
