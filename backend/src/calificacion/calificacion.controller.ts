import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly service: CalificacionService) {}

  @Post()
  create(@Body() dto: CreateCalificacionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('matricula/:matriculaId')
  findByMatricula(@Param('matriculaId', ParseIntPipe) matriculaId: number) {
    return this.service.findByMatricula(matriculaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCalificacionDto,
  ) {
    return this.service.update(id, dto);
  }
}

