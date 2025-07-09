import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditTeamDto } from "./dto/create-audit-team.dto";
import { UpdateAuditTeamDto } from "./dto/update-audit-team.dto";

@Injectable()
export class AuditTeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditTeamDto: CreateAuditTeamDto) {
    // Check if user is already in the audit team
    const existingMember = await this.prisma.auditTeam.findUnique({
      where: {
        auditId_userId: {
          auditId: createAuditTeamDto.auditId,
          userId: createAuditTeamDto.userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException(
        "User is already a member of this audit team"
      );
    }

    return this.prisma.auditTeam.create({
      data: createAuditTeamDto,
      include: {
        audit: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.auditTeam.findMany({
      include: {
        audit: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
  }

  async findByAudit(auditId: number) {
    return this.prisma.auditTeam.findMany({
      where: { auditId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        assignedAt: "asc",
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.auditTeam.findMany({
      where: { userId },
      include: {
        audit: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    const auditTeam = await this.prisma.auditTeam.findUnique({
      where: { id },
      include: {
        audit: {
          include: {
            area: {
              include: {
                department: true,
              },
            },
            leadAuditor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!auditTeam) {
      throw new NotFoundException("Audit team member not found");
    }

    return auditTeam;
  }

  async update(id: number, updateAuditTeamDto: UpdateAuditTeamDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.auditTeam.update({
      where: { id },
      data: updateAuditTeamDto,
      include: {
        audit: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
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
    await this.findOne(id); // Check if exists

    return this.prisma.auditTeam.delete({
      where: { id },
    });
  }

  async removeByAuditAndUser(auditId: number, userId: number) {
    const auditTeamMember = await this.prisma.auditTeam.findUnique({
      where: {
        auditId_userId: {
          auditId,
          userId,
        },
      },
    });

    if (!auditTeamMember) {
      throw new NotFoundException("Audit team member not found");
    }

    return this.prisma.auditTeam.delete({
      where: {
        auditId_userId: {
          auditId,
          userId,
        },
      },
    });
  }
}
