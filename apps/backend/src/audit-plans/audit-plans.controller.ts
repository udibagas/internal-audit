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
import { AuditPlansService } from "./audit-plans.service";
import { CreateAuditPlanDto } from "./dto/create-audit-plan.dto";
import { UpdateAuditPlanDto } from "./dto/update-audit-plan.dto";
import { CreateAuditPlanItemDto } from "./dto/create-audit-plan-item.dto";
import { UpdateAuditPlanItemDto } from "./dto/update-audit-plan-item.dto";

@ApiTags("Audit Plans")
@Controller("audit-plans")
export class AuditPlansController {
  constructor(private readonly auditPlansService: AuditPlansService) {}

  @Post()
  @ApiOperation({ summary: "Create a new audit plan" })
  @ApiResponse({ status: 201, description: "Audit plan created successfully" })
  create(@Body() createAuditPlanDto: CreateAuditPlanDto) {
    return this.auditPlansService.create(createAuditPlanDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all audit plans" })
  @ApiQuery({ name: "fiscalYear", required: false, type: String })
  findAll(@Query("fiscalYear") fiscalYear?: string) {
    if (fiscalYear) {
      return this.auditPlansService.findByFiscalYear(fiscalYear);
    }
    return this.auditPlansService.findAll();
  }

  @Get("items")
  @ApiOperation({ summary: "Get all audit plan items" })
  @ApiQuery({ name: "planId", required: false, type: Number })
  findAllItems(@Query("planId") planId?: string) {
    return this.auditPlansService.findAllItems(planId ? +planId : undefined);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get audit plan by ID" })
  @ApiResponse({ status: 200, description: "Audit plan found" })
  @ApiResponse({ status: 404, description: "Audit plan not found" })
  findOne(@Param("id") id: string) {
    return this.auditPlansService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update audit plan" })
  @ApiResponse({ status: 200, description: "Audit plan updated successfully" })
  @ApiResponse({ status: 404, description: "Audit plan not found" })
  update(
    @Param("id") id: string,
    @Body() updateAuditPlanDto: UpdateAuditPlanDto
  ) {
    return this.auditPlansService.update(+id, updateAuditPlanDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete audit plan" })
  @ApiResponse({ status: 200, description: "Audit plan deleted successfully" })
  @ApiResponse({ status: 404, description: "Audit plan not found" })
  remove(@Param("id") id: string) {
    return this.auditPlansService.remove(+id);
  }

  // Audit Plan Items endpoints
  @Post("items")
  @ApiOperation({ summary: "Create a new audit plan item" })
  @ApiResponse({
    status: 201,
    description: "Audit plan item created successfully",
  })
  createItem(@Body() createAuditPlanItemDto: CreateAuditPlanItemDto) {
    return this.auditPlansService.createItem(createAuditPlanItemDto);
  }

  @Get("items/:id")
  @ApiOperation({ summary: "Get audit plan item by ID" })
  @ApiResponse({ status: 200, description: "Audit plan item found" })
  @ApiResponse({ status: 404, description: "Audit plan item not found" })
  findOneItem(@Param("id") id: string) {
    return this.auditPlansService.findOneItem(+id);
  }

  @Patch("items/:id")
  @ApiOperation({ summary: "Update audit plan item" })
  @ApiResponse({
    status: 200,
    description: "Audit plan item updated successfully",
  })
  @ApiResponse({ status: 404, description: "Audit plan item not found" })
  updateItem(
    @Param("id") id: string,
    @Body() updateAuditPlanItemDto: UpdateAuditPlanItemDto
  ) {
    return this.auditPlansService.updateItem(+id, updateAuditPlanItemDto);
  }

  @Delete("items/:id")
  @ApiOperation({ summary: "Delete audit plan item" })
  @ApiResponse({
    status: 200,
    description: "Audit plan item deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Audit plan item not found" })
  removeItem(@Param("id") id: string) {
    return this.auditPlansService.removeItem(+id);
  }
}
