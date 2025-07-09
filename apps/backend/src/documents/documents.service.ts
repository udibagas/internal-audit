import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentDto) {
    return this.prisma.document.create({ data: dto });
  }

  async findAll() {
    return this.prisma.document.findMany();
  }

  async findOne(id: number) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException("Document not found");
    return document;
  }

  async update(id: number, dto: UpdateDocumentDto) {
    return this.prisma.document.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.document.delete({ where: { id } });
  }
}
