import { IsInt } from 'class-validator';

export class CreateAsignacionDocenteDto {
  @IsInt()
  docenteId: number;

  @IsInt()
  asignaturaId: number;

  @IsInt()
  periodoAcademicoId: number;
}
