import { IsString, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateProgramaAcademicoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  codigo?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  facultad?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracionSemestres?: number;
}
