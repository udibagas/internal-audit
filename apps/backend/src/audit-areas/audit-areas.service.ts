import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditAreaDto } from "./dto/create-audit-area.dto";
import { UpdateAuditAreaDto } from "./dto/update-audit-area.dto";

@Injectable()
export class AuditAreasService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditAreaDto: CreateAuditAreaDto) {
    return this.prisma.auditArea.create({
      data: createAuditAreaDto,
      include: {
        department: true,
      },
    });
  }

  async findAll() {
    return this.prisma.auditArea.findMany({
      include: {
        department: true,
        _count: {
          select: {
            audits: true,
            planItems: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const auditArea = await this.prisma.auditArea.findUnique({
      where: { id },
      include: {
        department: true,
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
        planItems: {
          include: {
            plan: true,
            assignedAuditor: {
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

    if (!auditArea) {
      throw new NotFoundException("Audit area not found");
    }

    return auditArea;
  }

  async update(id: number, updateAuditAreaDto: UpdateAuditAreaDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.auditArea.update({
      where: { id },
      data: updateAuditAreaDto,
      include: {
        department: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.auditArea.delete({
      where: { id },
    });
  }

  async findByDepartment(departmentId: number) {
    return this.prisma.auditArea.findMany({
      where: { departmentId },
      include: {
        department: true,
      },
    });
  }
}
