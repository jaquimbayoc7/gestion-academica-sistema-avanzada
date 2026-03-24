import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProgramaAcademicoModule } from './programa-academico/programa-academico.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { DocenteModule } from './docente/docente.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { PeriodoAcademicoModule } from './periodo-academico/periodo-academico.module';
import { AsignacionDocenteModule } from './asignacion-docente/asignacion-docente.module';
import { MatriculaModule } from './matricula/matricula.module';
import { CalificacionModule } from './calificacion/calificacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProgramaAcademicoModule,
    EstudianteModule,
    DocenteModule,
    AsignaturaModule,
    PeriodoAcademicoModule,
    AsignacionDocenteModule,
    MatriculaModule,
    CalificacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
