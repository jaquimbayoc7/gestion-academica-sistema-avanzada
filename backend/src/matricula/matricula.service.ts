import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';

@Injectable()
export class MatriculaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMatriculaDto) {
    const [estudiante, asignacion] = await Promise.all([
      this.prisma.estudiante.findUnique({ where: { id: dto.estudianteId } }),
      this.prisma.asignacionDocente.findUnique({ where: { id: dto.asignacionDocenteId } }),
    ]);
    if (!estudiante) {
      throw new NotFoundException(`Estudiante #${dto.estudianteId} no encontrado`);
    }
    if (!asignacion) {
      throw new NotFoundException(
        `AsignacionDocente #${dto.asignacionDocenteId} no encontrada`,
      );
    }
    const exists = await this.prisma.matricula.findFirst({
      where: {
        estudianteId: dto.estudianteId,
        asignacionDocenteId: dto.asignacionDocenteId,
      },
    });
    if (exists) {
      throw new ConflictException(
        'El estudiante ya está matriculado en esta asignación',
      );
    }
    return this.prisma.matricula.create({
      data: dto,
      include: {
        estudiante: { select: { id: true, nombres: true, apellidos: true } },
        asignacionDocente: {
          include: {
            asignatura: { select: { id: true, nombre: true } },
            periodoAcademico: { select: { id: true, nombre: true } },
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.matricula.findMany({
      include: {
        estudiante: { select: { id: true, nombres: true, apellidos: true } },
        asignacionDocente: {
          include: {
            asignatura: { select: { id: true, nombre: true } },
            periodoAcademico: { select: { id: true, nombre: true } },
          },
        },
        calificacion: { select: { notaDefinitiva: true } },
      },
      orderBy: { fechaInscripcion: 'desc' },
    });
  }

  async findByEstudiante(estudianteId: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id: estudianteId },
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante #${estudianteId} no encontrado`);
    }
    return this.prisma.matricula.findMany({
      where: { estudianteId },
      include: {
        asignacionDocente: {
          include: {
            asignatura: { select: { id: true, nombre: true } },
            periodoAcademico: { select: { id: true, nombre: true } },
          },
        },
        calificacion: { select: { notaDefinitiva: true } },
      },
    });
  }

  async findOne(id: number) {
    const matricula = await this.prisma.matricula.findUnique({
      where: { id },
      include: {
        estudiante: { select: { id: true, nombres: true, apellidos: true } },
        asignacionDocente: {
          include: {
            asignatura: { select: { id: true, nombre: true } },
            periodoAcademico: { select: { id: true, nombre: true } },
          },
        },
        calificacion: true,
      },
    });
    if (!matricula) {
      throw new NotFoundException(`Matricula #${id} no encontrada`);
    }
    return matricula;
  }

  async remove(id: number) {
    const matricula = await this.findOne(id);
    if (matricula.calificacion) {
      throw new BadRequestException(
        'No se puede cancelar una matrícula que ya tiene calificaciones registradas',
      );
    }
    return this.prisma.matricula.delete({ where: { id } });
  }
}

