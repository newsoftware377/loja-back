import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { CreateProductDto } from "./CreateProductDt";

export type UpdateProductDto = Partial<CreateProductDto>


export class UpdateProductWarehouseDto {
  @IsOptional()
  @IsString()
  nome: string

  @IsString()
  @IsOptional()
  categoriaId: string

  @IsOptional()
  @IsNumber()
  valorAtual: number

  @IsOptional()
  @IsNumber()
  valorOriginal: number

  @IsOptional()
  @IsNumber()
  valorCompra: number

  @IsNumber()
  @IsOptional()
  codigoBarra: number

  @IsOptional()
  @IsPositive()
  qtdMinima: number

  @IsString()
  lojaId: string
}

