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
import { AuditTeamsService } from "./audit-teams.service";
import { CreateAuditTeamDto } from "./dto/create-audit-team.dto";
import { UpdateAuditTeamDto } from "./dto/update-audit-team.dto";

@ApiTags("Audit Teams")
@Controller("audit-teams")
export class AuditTeamsController {
  constructor(private readonly auditTeamsService: AuditTeamsService) {}

  @Post()
  @ApiOperation({ summary: "Add member to audit team" })
  @ApiResponse({ status: 201, description: "Team member added successfully" })
  @ApiResponse({ status: 409, description: "User already in audit team" })
  create(@Body() createAuditTeamDto: CreateAuditTeamDto) {
    return this.auditTeamsService.create(createAuditTeamDto);
  }

  @Get()
  @ApiOperation({ summary: "Get audit team members" })
  @ApiQuery({ name: "auditId", required: false, type: Number })
  @ApiQuery({ name: "userId", required: false, type: Number })
  findAll(
    @Query("auditId") auditId?: string,
    @Query("userId") userId?: string
  ) {
    if (auditId) {
      return this.auditTeamsService.findByAudit(+auditId);
    }
    if (userId) {
      return this.auditTeamsService.findByUser(+userId);
    }
    return this.auditTeamsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get audit team member by ID" })
  @ApiResponse({ status: 200, description: "Team member found" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  findOne(@Param("id") id: string) {
    return this.auditTeamsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update audit team member role" })
  @ApiResponse({ status: 200, description: "Team member updated successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  update(
    @Param("id") id: string,
    @Body() updateAuditTeamDto: UpdateAuditTeamDto
  ) {
    return this.auditTeamsService.update(+id, updateAuditTeamDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove member from audit team" })
  @ApiResponse({ status: 200, description: "Team member removed successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  remove(@Param("id") id: string) {
    return this.auditTeamsService.remove(+id);
  }

  @Delete("audit/:auditId/user/:userId")
  @ApiOperation({ summary: "Remove specific user from audit team" })
  @ApiResponse({ status: 200, description: "Team member removed successfully" })
  @ApiResponse({ status: 404, description: "Team member not found" })
  removeByAuditAndUser(
    @Param("auditId") auditId: string,
    @Param("userId") userId: string
  ) {
    return this.auditTeamsService.removeByAuditAndUser(+auditId, +userId);
  }
}
