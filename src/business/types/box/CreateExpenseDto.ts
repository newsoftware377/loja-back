import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string

  @IsNumber()
  @IsPositive()
  valor: number
}
