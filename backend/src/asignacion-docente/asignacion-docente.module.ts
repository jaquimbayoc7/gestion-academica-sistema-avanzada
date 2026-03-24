import { Module } from '@nestjs/common';
import { AsignacionDocenteController } from './asignacion-docente.controller';
import { AsignacionDocenteService } from './asignacion-docente.service';

@Module({
  controllers: [AsignacionDocenteController],
  providers: [AsignacionDocenteService]
})
export class AsignacionDocenteModule {}
