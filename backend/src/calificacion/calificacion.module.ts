import { Module } from '@nestjs/common';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';

@Module({
  controllers: [CalificacionController],
  providers: [CalificacionService]
})
export class CalificacionModule {}
