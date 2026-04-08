import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class CreateDocenteDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  documentoIdentidad: string;

  @IsString()
  @IsNotEmpty()
  tituloProfesional: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsEmail()
  correoInstitucional: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
