import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AuditStandardsService } from "./audit-standards.service";
import { CreateAuditStandardDto } from "./dto/create-audit-standard.dto";
import { UpdateAuditStandardDto } from "./dto/update-audit-standard.dto";

@Controller("audit-standards")
export class AuditStandardsController {
  constructor(private readonly auditStandardsService: AuditStandardsService) {}

  @Post()
  create(@Body() createAuditStandardDto: CreateAuditStandardDto) {
    return this.auditStandardsService.create(createAuditStandardDto);
  }

  @Get()
  findAll() {
    return this.auditStandardsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auditStandardsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuditStandardDto: UpdateAuditStandardDto
  ) {
    return this.auditStandardsService.update(+id, updateAuditStandardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.auditStandardsService.remove(+id);
  }
}
