import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditStandardDto } from "./dto/create-audit-standard.dto";
import { UpdateAuditStandardDto } from "./dto/update-audit-standard.dto";

@Injectable()
export class AuditStandardsService {
  constructor(private prisma: PrismaService) {}

  create(createAuditStandardDto: CreateAuditStandardDto) {
    const data = {
      ...createAuditStandardDto,
      effectiveDate: createAuditStandardDto.effectiveDate
        ? new Date(createAuditStandardDto.effectiveDate)
        : undefined,
    };

    return this.prisma.auditStandard.create({
      data,
    });
  }

  findAll() {
    return this.prisma.auditStandard.findMany({
      include: {
        planItems: {
          include: {
            plan: true,
            area: true,
          },
        },
        audits: {
          include: {
            area: true,
            leadAuditor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.auditStandard.findUnique({
      where: { id },
      include: {
        planItems: {
          include: {
            plan: true,
            area: true,
          },
        },
        audits: {
          include: {
            area: true,
            leadAuditor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateAuditStandardDto: UpdateAuditStandardDto) {
    const data = {
      ...updateAuditStandardDto,
      effectiveDate: updateAuditStandardDto.effectiveDate
        ? new Date(updateAuditStandardDto.effectiveDate)
        : undefined,
    };

    return this.prisma.auditStandard.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.auditStandard.delete({
      where: { id },
    });
  }
}
