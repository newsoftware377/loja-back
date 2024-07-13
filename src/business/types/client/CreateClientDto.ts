import { Type } from "class-transformer"
import { IsNumber, IsObject, IsString, ValidateNested } from "class-validator"
import { Address } from "../shared/AddressDto"

export class CreateClientDto {
  @IsString()
  nome: string

  @IsNumber()
  telefone: number

  @IsString()
  cpf: string

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  endereco: Address
}
