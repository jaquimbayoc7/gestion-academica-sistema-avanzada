import { Module } from '@nestjs/common';
import { AsignaturaController } from './asignatura.controller';
import { AsignaturaService } from './asignatura.service';

@Module({
  controllers: [AsignaturaController],
  providers: [AsignaturaService]
})
export class AsignaturaModule {}
