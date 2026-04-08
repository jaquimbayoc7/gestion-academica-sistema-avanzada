import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Injectable()
export class DocenteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocenteDto) {
    const existing = await this.prisma.docente.findFirst({
      where: {
        OR: [
          { documentoIdentidad: dto.documentoIdentidad },
          { correoInstitucional: dto.correoInstitucional },
        ],
      },
    });
    if (existing) {
      throw new ConflictException(
        'Ya existe un docente con el mismo documento o correo',
      );
    }
    return this.prisma.docente.create({ data: dto });
  }

  findAll() {
    return this.prisma.docente.findMany({ orderBy: { apellidos: 'asc' } });
  }

  async findOne(id: number) {
    const docente = await this.prisma.docente.findUnique({ where: { id } });
    if (!docente) {
      throw new NotFoundException(`Docente #${id} no encontrado`);
    }
    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto) {
    await this.findOne(id);
    if (dto.documentoIdentidad || dto.correoInstitucional) {
      const existing = await this.prisma.docente.findFirst({
        where: {
          NOT: { id },
          OR: [
            ...(dto.documentoIdentidad ? [{ documentoIdentidad: dto.documentoIdentidad }] : []),
            ...(dto.correoInstitucional ? [{ correoInstitucional: dto.correoInstitucional }] : []),
          ],
        },
      });
      if (existing) {
        throw new ConflictException(
          'Ya existe un docente con el mismo documento o correo',
        );
      }
    }
    return this.prisma.docente.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.docente.delete({ where: { id } });
  }
}

