import { Module } from '@nestjs/common';
import { ProgramaAcademicoController } from './programa-academico.controller';
import { ProgramaAcademicoService } from './programa-academico.service';

@Module({
  controllers: [ProgramaAcademicoController],
  providers: [ProgramaAcademicoService]
})
export class ProgramaAcademicoModule {}
