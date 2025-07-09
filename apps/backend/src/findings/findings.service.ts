import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFindingDto } from "./dto/create-finding.dto";
import { UpdateFindingDto } from "./dto/update-finding.dto";

@Injectable()
export class FindingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFindingDto) {
    return this.prisma.finding.create({ data: dto });
  }

  async findAll() {
    return this.prisma.finding.findMany();
  }

  async findOne(id: number) {
    const finding = await this.prisma.finding.findUnique({ where: { id } });
    if (!finding) throw new NotFoundException("Finding not found");
    return finding;
  }

  async update(id: number, dto: UpdateFindingDto) {
    return this.prisma.finding.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.finding.delete({ where: { id } });
  }
}
