import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeriodoAcademicoDto } from './dto/create-periodo-academico.dto';
import { UpdatePeriodoAcademicoDto } from './dto/update-periodo-academico.dto';

@Injectable()
export class PeriodoAcademicoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePeriodoAcademicoDto) {
    const exists = await this.prisma.periodoAcademico.findUnique({
      where: { nombre: dto.nombre },
    });
    if (exists) {
      throw new ConflictException(`El período '${dto.nombre}' ya existe`);
    }
    if (dto.activo) {
      await this.prisma.periodoAcademico.updateMany({
        where: { activo: true },
        data: { activo: false },
      });
    }
    return this.prisma.periodoAcademico.create({
      data: {
        ...dto,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
      },
    });
  }

  findAll() {
    return this.prisma.periodoAcademico.findMany({
      orderBy: { fechaInicio: 'desc' },
    });
  }

  async findOne(id: number) {
    const periodo = await this.prisma.periodoAcademico.findUnique({ where: { id } });
    if (!periodo) {
      throw new NotFoundException(`PeriodoAcademico #${id} no encontrado`);
    }
    return periodo;
  }

  async update(id: number, dto: UpdatePeriodoAcademicoDto) {
    await this.findOne(id);
    if (dto.nombre) {
      const existing = await this.prisma.periodoAcademico.findFirst({
        where: { nombre: dto.nombre, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`El período '${dto.nombre}' ya existe`);
      }
    }
    if (dto.activo === true) {
      await this.prisma.periodoAcademico.updateMany({
        where: { activo: true, NOT: { id } },
        data: { activo: false },
      });
    }
    return this.prisma.periodoAcademico.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.fechaInicio && { fechaInicio: new Date(dto.fechaInicio) }),
        ...(dto.fechaFin && { fechaFin: new Date(dto.fechaFin) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.periodoAcademico.delete({ where: { id } });
  }
}

