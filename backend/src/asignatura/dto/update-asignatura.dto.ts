import { IsString, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateAsignaturaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  codigo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  creditos?: number;

  @IsOptional()
  @IsInt()
  programaAcademicoId?: number;
}
