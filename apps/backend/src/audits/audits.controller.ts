import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AuditsService } from "./audits.service";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";

@Controller("audits")
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Post()
  create(@Body() createAuditDto: CreateAuditDto) {
    return this.auditsService.create(createAuditDto);
  }

  @Get()
  findAll() {
    return this.auditsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auditsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditsService.update(+id, updateAuditDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.auditsService.remove(+id);
  }
}
