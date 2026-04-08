import { IsInt } from 'class-validator';

export class CreateMatriculaDto {
  @IsInt()
  estudianteId: number;

  @IsInt()
  asignacionDocenteId: number;
}
