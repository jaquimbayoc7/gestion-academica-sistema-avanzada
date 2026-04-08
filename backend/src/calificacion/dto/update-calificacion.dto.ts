import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateCalificacionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  nota1?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  nota2?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  nota3?: number;
}
