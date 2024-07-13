import { IsString } from "class-validator";

export class AuthShopDto {
  @IsString()
  lojaId: string

  @IsString()
  empresaId: string
}
