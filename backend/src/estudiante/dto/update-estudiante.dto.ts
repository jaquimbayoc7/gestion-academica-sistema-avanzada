import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdateEstudianteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombres?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  apellidos?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  codigoEstudiantil?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  documentoIdentidad?: string;

  @IsOptional()
  @IsEmail()
  correoInstitucional?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsInt()
  programaAcademicoId?: number;
}
