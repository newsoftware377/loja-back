import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  nome: string

  @IsString()
  categoria: string

  @IsOptional()
  @IsNumber()
  valorAtual: number

  @IsNumber()
  valorOriginal: number
}
