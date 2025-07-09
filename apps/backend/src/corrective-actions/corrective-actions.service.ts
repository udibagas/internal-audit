import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCorrectiveActionDto } from "./dto/create-corrective-action.dto";
import { UpdateCorrectiveActionDto } from "./dto/update-corrective-action.dto";

@Injectable()
export class CorrectiveActionsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCorrectiveActionDto) {
    return this.prisma.correctiveAction.create({
      data: {
        ...createDto,
        dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
        completionDate: createDto.completionDate
          ? new Date(createDto.completionDate)
          : undefined,
        verifiedDate: createDto.verifiedDate
          ? new Date(createDto.verifiedDate)
          : undefined,
      },
      include: {
        finding: true,
        assignedTo: true,
        verifiedBy: true,
      },
    });
  }

  async findAll() {
    return this.prisma.correctiveAction.findMany({
      include: {
        finding: true,
        assignedTo: true,
        verifiedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const action = await this.prisma.correctiveAction.findUnique({
      where: { id },
      include: {
        finding: true,
        assignedTo: true,
        verifiedBy: true,
      },
    });
    if (!action) throw new NotFoundException("Corrective action not found");
    return action;
  }

  async update(id: number, updateDto: UpdateCorrectiveActionDto) {
    await this.findOne(id);
    return this.prisma.correctiveAction.update({
      where: { id },
      data: {
        ...updateDto,
        dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
        completionDate: updateDto.completionDate
          ? new Date(updateDto.completionDate)
          : undefined,
        verifiedDate: updateDto.verifiedDate
          ? new Date(updateDto.verifiedDate)
          : undefined,
      },
      include: {
        finding: true,
        assignedTo: true,
        verifiedBy: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.correctiveAction.delete({ where: { id } });
  }

  async findByFinding(findingId: number) {
    return this.prisma.correctiveAction.findMany({
      where: { findingId },
      include: {
        finding: true,
        assignedTo: true,
        verifiedBy: true,
      },
    });
  }
}
