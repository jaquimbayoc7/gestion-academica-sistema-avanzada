import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProgramaAcademicoService } from './programa-academico.service';
import { CreateProgramaAcademicoDto } from './dto/create-programa-academico.dto';
import { UpdateProgramaAcademicoDto } from './dto/update-programa-academico.dto';

@Controller('programa-academico')
export class ProgramaAcademicoController {
  constructor(private readonly service: ProgramaAcademicoService) {}

  @Post()
  create(@Body() dto: CreateProgramaAcademicoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProgramaAcademicoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

