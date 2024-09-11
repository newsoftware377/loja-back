import { Type } from "class-transformer";
import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { Address } from "../shared/AddressDto";

export class CreateShopDto {
  @IsString()
  nome: string 

  @IsString()
  cnpj: string

  @IsString()
  empresaId: string

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  endereco: Address
}

