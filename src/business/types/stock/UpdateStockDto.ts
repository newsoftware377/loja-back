import { IsMongoId, IsNumber, IsPositive } from "class-validator";

export class UpdateStockDto {
  @IsMongoId()
  produtoId: string

  @IsNumber()
  @IsPositive()
  qtd: number
}
