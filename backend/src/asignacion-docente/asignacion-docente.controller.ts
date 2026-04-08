import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AsignacionDocenteService } from './asignacion-docente.service';
import { CreateAsignacionDocenteDto } from './dto/create-asignacion-docente.dto';

@Controller('asignacion-docente')
export class AsignacionDocenteController {
  constructor(private readonly service: AsignacionDocenteService) {}

  @Post()
  create(@Body() dto: CreateAsignacionDocenteDto) {
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

