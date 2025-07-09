import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { FindingsService } from "./findings.service";
import { CreateFindingDto } from "./dto/create-finding.dto";
import { UpdateFindingDto } from "./dto/update-finding.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("findings")
@Controller("findings")
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Post()
  @ApiOperation({ summary: "Create a finding" })
  create(@Body() dto: CreateFindingDto) {
    return this.findingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all findings" })
  findAll() {
    return this.findingsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a finding by id" })
  findOne(@Param("id") id: string) {
    return this.findingsService.findOne(Number(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a finding" })
  update(@Param("id") id: string, @Body() dto: UpdateFindingDto) {
    return this.findingsService.update(Number(id), dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a finding" })
  remove(@Param("id") id: string) {
    return this.findingsService.remove(Number(id));
  }
}
