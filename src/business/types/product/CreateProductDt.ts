import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  nome: string

  @IsString()
  categoriaId: string

  @IsOptional()
  @IsNumber()
  valorAtual: number

  @IsNumber()
  valorOriginal: number

  @IsNumber()
  valorCompra: number

  @IsNumber()
  codigoBarra: number
}
