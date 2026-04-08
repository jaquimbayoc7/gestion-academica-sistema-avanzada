import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateProgramaAcademicoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  facultad: string;

  @IsInt()
  @Min(1)
  duracionSemestres: number;
}
