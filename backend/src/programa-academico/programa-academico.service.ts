import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramaAcademicoDto } from './dto/create-programa-academico.dto';
import { UpdateProgramaAcademicoDto } from './dto/update-programa-academico.dto';

@Injectable()
export class ProgramaAcademicoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProgramaAcademicoDto) {
    const exists = await this.prisma.programaAcademico.findUnique({
      where: { codigo: dto.codigo },
    });
    if (exists) {
      throw new ConflictException(`El código '${dto.codigo}' ya está en uso`);
    }
    return this.prisma.programaAcademico.create({ data: dto });
  }

  findAll() {
    return this.prisma.programaAcademico.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const programa = await this.prisma.programaAcademico.findUnique({
      where: { id },
      include: { estudiantes: true, asignaturas: true },
    });
    if (!programa) {
      throw new NotFoundException(`ProgramaAcademico #${id} no encontrado`);
    }
    return programa;
  }

  async update(id: number, dto: UpdateProgramaAcademicoDto) {
    await this.findOne(id);
    if (dto.codigo) {
      const existing = await this.prisma.programaAcademico.findFirst({
        where: { codigo: dto.codigo, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`El código '${dto.codigo}' ya está en uso`);
      }
    }
    return this.prisma.programaAcademico.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.programaAcademico.delete({ where: { id } });
  }
}

