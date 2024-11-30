import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

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

  @IsOptional()
  @IsPositive()
  qtdMinima: number
}

export class CreateProductWarehouseDto extends CreateProductDto {
  @IsString()
  lojaId?: string

  @IsPositive()
  qtdDeposito: number
}


