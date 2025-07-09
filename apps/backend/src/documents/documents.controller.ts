import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("documents")
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a document" })
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all documents" })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a document by id" })
  findOne(@Param("id") id: string) {
    return this.documentsService.findOne(Number(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a document" })
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(Number(id), dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a document" })
  remove(@Param("id") id: string) {
    return this.documentsService.remove(Number(id));
  }
}
