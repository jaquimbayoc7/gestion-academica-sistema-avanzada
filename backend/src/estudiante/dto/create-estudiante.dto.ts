import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  codigoEstudiantil: string;

  @IsString()
  @IsNotEmpty()
  documentoIdentidad: string;

  @IsEmail()
  correoInstitucional: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsInt()
  programaAcademicoId: number;
}
