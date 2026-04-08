import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateDocenteDto {
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
  documentoIdentidad?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tituloProfesional?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  especialidad?: string;

  @IsOptional()
  @IsEmail()
  correoInstitucional?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
