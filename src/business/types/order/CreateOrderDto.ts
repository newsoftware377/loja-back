import { Type } from "class-transformer"
import { IsBoolean, IsOptional, IsPositive, IsString } from "class-validator"

class CrateItem {
  @IsPositive()
  qtd: number

  @IsString()
  id: string
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  clienteId: string

  @Type(() => CrateItem)
  produtos: CrateItem[]

  @IsBoolean()
  paraEntrega: boolean

  @IsOptional()
  @IsPositive()
  acressimo?: number

  @IsOptional()
  @IsPositive()
  desconto?: number

  @IsString()
  pagamento: string
}
