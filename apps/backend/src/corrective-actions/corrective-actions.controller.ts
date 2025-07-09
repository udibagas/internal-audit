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
import { CorrectiveActionsService } from "./corrective-actions.service";
import { CreateCorrectiveActionDto } from "./dto/create-corrective-action.dto";
import { UpdateCorrectiveActionDto } from "./dto/update-corrective-action.dto";

@ApiTags("Corrective Actions")
@Controller("corrective-actions")
export class CorrectiveActionsController {
  constructor(
    private readonly correctiveActionsService: CorrectiveActionsService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new corrective action" })
  @ApiResponse({
    status: 201,
    description: "Corrective action created successfully",
  })
  create(@Body() createDto: CreateCorrectiveActionDto) {
    return this.correctiveActionsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all corrective actions" })
  @ApiQuery({ name: "findingId", required: false, type: Number })
  findAll(@Query("findingId") findingId?: string) {
    if (findingId) {
      return this.correctiveActionsService.findByFinding(+findingId);
    }
    return this.correctiveActionsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get corrective action by ID" })
  @ApiResponse({ status: 200, description: "Corrective action found" })
  @ApiResponse({ status: 404, description: "Corrective action not found" })
  findOne(@Param("id") id: string) {
    return this.correctiveActionsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update corrective action" })
  @ApiResponse({
    status: 200,
    description: "Corrective action updated successfully",
  })
  @ApiResponse({ status: 404, description: "Corrective action not found" })
  update(
    @Param("id") id: string,
    @Body() updateDto: UpdateCorrectiveActionDto
  ) {
    return this.correctiveActionsService.update(+id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete corrective action" })
  @ApiResponse({
    status: 200,
    description: "Corrective action deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Corrective action not found" })
  remove(@Param("id") id: string) {
    return this.correctiveActionsService.remove(+id);
  }
}
