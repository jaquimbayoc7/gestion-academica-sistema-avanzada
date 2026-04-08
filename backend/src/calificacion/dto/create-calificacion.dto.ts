import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateCalificacionDto {
  @IsInt()
  matriculaId: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  nota1: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  nota2: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  nota3: number;
}
