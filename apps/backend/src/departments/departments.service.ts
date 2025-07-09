import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: createDepartmentDto,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.department.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        auditAreas: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        auditAreas: true,
      },
    });
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
