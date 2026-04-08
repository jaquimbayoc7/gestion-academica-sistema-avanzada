import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Injectable()
export class AsignaturaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAsignaturaDto) {
    const exists = await this.prisma.asignatura.findUnique({
      where: { codigo: dto.codigo },
    });
    if (exists) {
      throw new ConflictException(`El código '${dto.codigo}' ya está en uso`);
    }
    const programa = await this.prisma.programaAcademico.findUnique({
      where: { id: dto.programaAcademicoId },
    });
    if (!programa) {
      throw new NotFoundException(
        `ProgramaAcademico #${dto.programaAcademicoId} no encontrado`,
      );
    }
    return this.prisma.asignatura.create({
      data: dto,
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
  }

  findAll() {
    return this.prisma.asignatura.findMany({
      include: { programaAcademico: { select: { id: true, nombre: true } } },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const asignatura = await this.prisma.asignatura.findUnique({
      where: { id },
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
    if (!asignatura) {
      throw new NotFoundException(`Asignatura #${id} no encontrada`);
    }
    return asignatura;
  }

  async update(id: number, dto: UpdateAsignaturaDto) {
    await this.findOne(id);
    if (dto.codigo) {
      const existing = await this.prisma.asignatura.findFirst({
        where: { codigo: dto.codigo, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`El código '${dto.codigo}' ya está en uso`);
      }
    }
    if (dto.programaAcademicoId) {
      const programa = await this.prisma.programaAcademico.findUnique({
        where: { id: dto.programaAcademicoId },
      });
      if (!programa) {
        throw new NotFoundException(
          `ProgramaAcademico #${dto.programaAcademicoId} no encontrado`,
        );
      }
    }
    return this.prisma.asignatura.update({
      where: { id },
      data: dto,
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.asignatura.delete({ where: { id } });
  }
}

