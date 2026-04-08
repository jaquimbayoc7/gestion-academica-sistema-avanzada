import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsInt()
  @Min(1)
  creditos: number;

  @IsInt()
  programaAcademicoId: number;
}
