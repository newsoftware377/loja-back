import { IsPositive, Max } from "class-validator";

export class AllProductInPromotion {
  @IsPositive()
  @Max(99, { message: "Deve ser menor que 99"})
  porcentagemDesconto: number
}
