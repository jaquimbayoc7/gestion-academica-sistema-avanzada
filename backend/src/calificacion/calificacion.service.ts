import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionService {
  constructor(private readonly prisma: PrismaService) {}

  private calcularNotaDefinitiva(nota1: number, nota2: number, nota3: number): number {
    return Math.round((nota1 * 0.3 + nota2 * 0.3 + nota3 * 0.4) * 100) / 100;
  }

  async create(dto: CreateCalificacionDto) {
    const matricula = await this.prisma.matricula.findUnique({
      where: { id: dto.matriculaId },
    });
    if (!matricula) {
      throw new NotFoundException(`Matricula #${dto.matriculaId} no encontrada`);
    }
    const existing = await this.prisma.calificacion.findUnique({
      where: { matriculaId: dto.matriculaId },
    });
    if (existing) {
      throw new ConflictException(
        `Ya existen calificaciones para la matrícula #${dto.matriculaId}`,
      );
    }
    const notaDefinitiva = this.calcularNotaDefinitiva(dto.nota1, dto.nota2, dto.nota3);
    return this.prisma.calificacion.create({
      data: { ...dto, notaDefinitiva },
      include: {
        matricula: {
          include: {
            estudiante: { select: { id: true, nombres: true, apellidos: true } },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.calificacion.findMany({
      include: {
        matricula: {
          include: {
            estudiante: { select: { id: true, nombres: true, apellidos: true } },
            asignacionDocente: {
              include: {
                asignatura: { select: { id: true, nombre: true } },
              },
            },
          },
        },
      },
    });
  }

  async findByMatricula(matriculaId: number) {
    const calificacion = await this.prisma.calificacion.findUnique({
      where: { matriculaId },
      include: {
        matricula: {
          include: {
            estudiante: { select: { id: true, nombres: true, apellidos: true } },
          },
        },
      },
    });
    if (!calificacion) {
      throw new NotFoundException(
        `No hay calificaciones para la matrícula #${matriculaId}`,
      );
    }
    return calificacion;
  }

  async findOne(id: number) {
    const calificacion = await this.prisma.calificacion.findUnique({
      where: { id },
      include: {
        matricula: {
          include: {
            estudiante: { select: { id: true, nombres: true, apellidos: true } },
          },
        },
      },
    });
    if (!calificacion) {
      throw new NotFoundException(`Calificacion #${id} no encontrada`);
    }
    return calificacion;
  }

  async update(id: number, dto: UpdateCalificacionDto) {
    const current = await this.findOne(id);
    const nota1 = dto.nota1 ?? current.nota1;
    const nota2 = dto.nota2 ?? current.nota2;
    const nota3 = dto.nota3 ?? current.nota3;
    const notaDefinitiva = this.calcularNotaDefinitiva(nota1, nota2, nota3);
    return this.prisma.calificacion.update({
      where: { id },
      data: { ...dto, notaDefinitiva },
      include: {
        matricula: {
          include: {
            estudiante: { select: { id: true, nombres: true, apellidos: true } },
          },
        },
      },
    });
  }
}

