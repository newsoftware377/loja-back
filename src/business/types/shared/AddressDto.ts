import { IsNumber, IsString } from "class-validator"

export class Address {
  @IsString()
  endereco: string

  @IsString()
  bairro: string

  @IsString()
  cidade: string

  @IsString()
  estado: string

  @IsString()
  cep: string

  @IsNumber()
  numero: number
}
