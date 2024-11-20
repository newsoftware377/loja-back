import { IsString } from "class-validator";

export class AuthWarehouseDto {
  @IsString()
  depositoId: string

  @IsString()
  empresaId: string
}
