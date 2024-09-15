import { IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  senha: string;

  @IsString()
  empresaId: string
}

