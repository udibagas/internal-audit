import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditPlanDto } from "./dto/create-audit-plan.dto";
import { UpdateAuditPlanDto } from "./dto/update-audit-plan.dto";
import { CreateAuditPlanItemDto } from "./dto/create-audit-plan-item.dto";
import { UpdateAuditPlanItemDto } from "./dto/update-audit-plan-item.dto";

@Injectable()
export class AuditPlansService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditPlanDto: CreateAuditPlanDto) {
    return this.prisma.auditPlan.create({
      data: createAuditPlanDto,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.auditPlan.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const auditPlan = await this.prisma.auditPlan.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            area: {
              include: {
                department: true,
              },
            },
            standard: true,
            assignedAuditor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            audits: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!auditPlan) {
      throw new NotFoundException("Audit plan not found");
    }

    return auditPlan;
  }

  async update(id: number, updateAuditPlanDto: UpdateAuditPlanDto) {
    await this.findOne(id); // Check if exists

    // If approving the plan, set approvedAt timestamp
    const updateData: any = { ...updateAuditPlanDto };
    if (
      updateAuditPlanDto.approvedById &&
      updateAuditPlanDto.status === "Approved"
    ) {
      updateData.approvedAt = new Date();
    }

    return this.prisma.auditPlan.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const auditPlan = await this.findOne(id); // Check if exists

    // Check if plan has items
    if (auditPlan.items.length > 0) {
      throw new ForbiddenException(
        "Cannot delete audit plan with existing items"
      );
    }

    return this.prisma.auditPlan.delete({
      where: { id },
    });
  }

  // Audit Plan Items methods
  async createItem(createAuditPlanItemDto: CreateAuditPlanItemDto) {
    return this.prisma.auditPlanItem.create({
      data: {
        ...createAuditPlanItemDto,
        plannedStartDate: createAuditPlanItemDto.plannedStartDate
          ? new Date(createAuditPlanItemDto.plannedStartDate)
          : undefined,
        plannedEndDate: createAuditPlanItemDto.plannedEndDate
          ? new Date(createAuditPlanItemDto.plannedEndDate)
          : undefined,
      },
      include: {
        plan: true,
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        assignedAuditor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAllItems(planId?: number) {
    const where = planId ? { planId } : {};

    return this.prisma.auditPlanItem.findMany({
      where,
      include: {
        plan: true,
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        assignedAuditor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        audits: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOneItem(id: number) {
    const planItem = await this.prisma.auditPlanItem.findUnique({
      where: { id },
      include: {
        plan: true,
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        assignedAuditor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        audits: {
          include: {
            leadAuditor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!planItem) {
      throw new NotFoundException("Audit plan item not found");
    }

    return planItem;
  }

  async updateItem(id: number, updateAuditPlanItemDto: UpdateAuditPlanItemDto) {
    await this.findOneItem(id); // Check if exists

    return this.prisma.auditPlanItem.update({
      where: { id },
      data: {
        ...updateAuditPlanItemDto,
        plannedStartDate: updateAuditPlanItemDto.plannedStartDate
          ? new Date(updateAuditPlanItemDto.plannedStartDate)
          : undefined,
        plannedEndDate: updateAuditPlanItemDto.plannedEndDate
          ? new Date(updateAuditPlanItemDto.plannedEndDate)
          : undefined,
      },
      include: {
        plan: true,
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        assignedAuditor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeItem(id: number) {
    const planItem = await this.findOneItem(id); // Check if exists

    // Check if item has audits
    if (planItem.audits.length > 0) {
      throw new ForbiddenException(
        "Cannot delete plan item with existing audits"
      );
    }

    return this.prisma.auditPlanItem.delete({
      where: { id },
    });
  }

  async findByFiscalYear(fiscalYear: string) {
    return this.prisma.auditPlan.findMany({
      where: { fiscalYear },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }
}
