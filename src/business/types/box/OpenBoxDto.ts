import { IsPositive } from "class-validator";

export class OpenBoxDto {
  @IsPositive()
  valorInicial: number
}
