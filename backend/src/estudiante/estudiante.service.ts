import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEstudianteDto) {
    const existing = await this.prisma.estudiante.findFirst({
      where: {
        OR: [
          { codigoEstudiantil: dto.codigoEstudiantil },
          { documentoIdentidad: dto.documentoIdentidad },
          { correoInstitucional: dto.correoInstitucional },
        ],
      },
    });
    if (existing) {
      throw new ConflictException(
        'Ya existe un estudiante con el mismo código, documento o correo',
      );
    }
    const programa = await this.prisma.programaAcademico.findUnique({
      where: { id: dto.programaAcademicoId },
    });
    if (!programa) {
      throw new NotFoundException(
        `ProgramaAcademico #${dto.programaAcademicoId} no encontrado`,
      );
    }
    return this.prisma.estudiante.create({
      data: { ...dto, fechaNacimiento: new Date(dto.fechaNacimiento) },
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      include: { programaAcademico: { select: { id: true, nombre: true } } },
      orderBy: { apellidos: 'asc' },
    });
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id },
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante #${id} no encontrado`);
    }
    return estudiante;
  }

  async update(id: number, dto: UpdateEstudianteDto) {
    await this.findOne(id);
    if (dto.codigoEstudiantil || dto.documentoIdentidad || dto.correoInstitucional) {
      const existing = await this.prisma.estudiante.findFirst({
        where: {
          NOT: { id },
          OR: [
            ...(dto.codigoEstudiantil ? [{ codigoEstudiantil: dto.codigoEstudiantil }] : []),
            ...(dto.documentoIdentidad ? [{ documentoIdentidad: dto.documentoIdentidad }] : []),
            ...(dto.correoInstitucional ? [{ correoInstitucional: dto.correoInstitucional }] : []),
          ],
        },
      });
      if (existing) {
        throw new ConflictException(
          'Ya existe un estudiante con el mismo código, documento o correo',
        );
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
    return this.prisma.estudiante.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.fechaNacimiento && { fechaNacimiento: new Date(dto.fechaNacimiento) }),
      },
      include: { programaAcademico: { select: { id: true, nombre: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estudiante.delete({ where: { id } });
  }
}

