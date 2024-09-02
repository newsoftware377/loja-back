import { IsEmail, IsPositive, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  nome: string

  @IsString()
  senha: string

  @IsEmail()
  email: string

  @IsPositive()
  telefone: number
}

