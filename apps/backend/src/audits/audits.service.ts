import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";

@Injectable()
export class AuditsService {
  constructor(private prisma: PrismaService) {}

  create(createAuditDto: CreateAuditDto) {
    const data = {
      ...createAuditDto,
      startDate: createAuditDto.startDate
        ? new Date(createAuditDto.startDate)
        : undefined,
      endDate: createAuditDto.endDate
        ? new Date(createAuditDto.endDate)
        : undefined,
    };

    return this.prisma.audit.create({
      data,
      include: {
        planItem: {
          include: {
            plan: true,
            area: true,
          },
        },
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        leadAuditor: {
          select: {
            id: true,
            name: true,
          },
        },
        teamMembers: {
          include: {
            user: {
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

  findAll() {
    return this.prisma.audit.findMany({
      include: {
        planItem: {
          include: {
            plan: true,
            area: true,
          },
        },
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        leadAuditor: {
          select: {
            id: true,
            name: true,
          },
        },
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        findings: {
          include: {
            identifiedBy: {
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
    return this.prisma.audit.findUnique({
      where: { id },
      include: {
        planItem: {
          include: {
            plan: true,
            area: true,
          },
        },
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        leadAuditor: {
          select: {
            id: true,
            name: true,
          },
        },
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        checklists: true,
        findings: {
          include: {
            identifiedBy: {
              select: {
                id: true,
                name: true,
              },
            },
            correctiveActions: true,
          },
        },
        reports: true,
      },
    });
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    const data = {
      ...updateAuditDto,
      startDate: updateAuditDto.startDate
        ? new Date(updateAuditDto.startDate)
        : undefined,
      endDate: updateAuditDto.endDate
        ? new Date(updateAuditDto.endDate)
        : undefined,
    };

    return this.prisma.audit.update({
      where: { id },
      data,
      include: {
        planItem: {
          include: {
            plan: true,
            area: true,
          },
        },
        area: {
          include: {
            department: true,
          },
        },
        standard: true,
        leadAuditor: {
          select: {
            id: true,
            name: true,
          },
        },
        teamMembers: {
          include: {
            user: {
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

  remove(id: number) {
    return this.prisma.audit.delete({
      where: { id },
    });
  }
}
