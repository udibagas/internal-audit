import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { AuditAreasService } from "./audit-areas.service";
import { CreateAuditAreaDto } from "./dto/create-audit-area.dto";
import { UpdateAuditAreaDto } from "./dto/update-audit-area.dto";

@ApiTags("Audit Areas")
@Controller("audit-areas")
export class AuditAreasController {
  constructor(private readonly auditAreasService: AuditAreasService) {}

  @Post()
  @ApiOperation({ summary: "Create a new audit area" })
  @ApiResponse({ status: 201, description: "Audit area created successfully" })
  create(@Body() createAuditAreaDto: CreateAuditAreaDto) {
    return this.auditAreasService.create(createAuditAreaDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all audit areas" })
  @ApiQuery({ name: "departmentId", required: false, type: Number })
  findAll(@Query("departmentId") departmentId?: string) {
    if (departmentId) {
      return this.auditAreasService.findByDepartment(+departmentId);
    }
    return this.auditAreasService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get audit area by ID" })
  @ApiResponse({ status: 200, description: "Audit area found" })
  @ApiResponse({ status: 404, description: "Audit area not found" })
  findOne(@Param("id") id: string) {
    return this.auditAreasService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update audit area" })
  @ApiResponse({ status: 200, description: "Audit area updated successfully" })
  @ApiResponse({ status: 404, description: "Audit area not found" })
  update(
    @Param("id") id: string,
    @Body() updateAuditAreaDto: UpdateAuditAreaDto
  ) {
    return this.auditAreasService.update(+id, updateAuditAreaDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete audit area" })
  @ApiResponse({ status: 200, description: "Audit area deleted successfully" })
  @ApiResponse({ status: 404, description: "Audit area not found" })
  remove(@Param("id") id: string) {
    return this.auditAreasService.remove(+id);
  }
}
