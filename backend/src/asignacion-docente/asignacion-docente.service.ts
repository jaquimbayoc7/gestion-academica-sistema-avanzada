import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignacionDocenteDto } from './dto/create-asignacion-docente.dto';

@Injectable()
export class AsignacionDocenteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAsignacionDocenteDto) {
    const [docente, asignatura, periodo] = await Promise.all([
      this.prisma.docente.findUnique({ where: { id: dto.docenteId } }),
      this.prisma.asignatura.findUnique({ where: { id: dto.asignaturaId } }),
      this.prisma.periodoAcademico.findUnique({ where: { id: dto.periodoAcademicoId } }),
    ]);
    if (!docente) throw new NotFoundException(`Docente #${dto.docenteId} no encontrado`);
    if (!asignatura) throw new NotFoundException(`Asignatura #${dto.asignaturaId} no encontrada`);
    if (!periodo) throw new NotFoundException(`PeriodoAcademico #${dto.periodoAcademicoId} no encontrado`);

    const exists = await this.prisma.asignacionDocente.findFirst({
      where: {
        docenteId: dto.docenteId,
        asignaturaId: dto.asignaturaId,
        periodoAcademicoId: dto.periodoAcademicoId,
      },
    });
    if (exists) {
      throw new ConflictException(
        'El docente ya está asignado a esta asignatura en este período',
      );
    }
    return this.prisma.asignacionDocente.create({
      data: dto,
      include: {
        docente: { select: { id: true, nombres: true, apellidos: true } },
        asignatura: { select: { id: true, nombre: true, codigo: true } },
        periodoAcademico: { select: { id: true, nombre: true } },
      },
    });
  }

  findAll() {
    return this.prisma.asignacionDocente.findMany({
      include: {
        docente: { select: { id: true, nombres: true, apellidos: true } },
        asignatura: { select: { id: true, nombre: true, codigo: true } },
        periodoAcademico: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const asignacion = await this.prisma.asignacionDocente.findUnique({
      where: { id },
      include: {
        docente: { select: { id: true, nombres: true, apellidos: true } },
        asignatura: { select: { id: true, nombre: true, codigo: true } },
        periodoAcademico: { select: { id: true, nombre: true } },
        matriculas: true,
      },
    });
    if (!asignacion) {
      throw new NotFoundException(`AsignacionDocente #${id} no encontrada`);
    }
    return asignacion;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.asignacionDocente.delete({ where: { id } });
  }
}

