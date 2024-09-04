import { IsEmail, IsOptional, IsPositive, IsString } from "class-validator"

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @IsPositive()
  telefone: number

}
