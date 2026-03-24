import { Module } from '@nestjs/common';
import { PeriodoAcademicoController } from './periodo-academico.controller';
import { PeriodoAcademicoService } from './periodo-academico.service';

@Module({
  controllers: [PeriodoAcademicoController],
  providers: [PeriodoAcademicoService]
})
export class PeriodoAcademicoModule {}
