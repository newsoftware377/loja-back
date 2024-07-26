import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsOptional, IsPositive, IsString } from "class-validator"
import { Payments } from "./OrderPayments"

export class CrateItem {
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

  @IsEnum(Payments, { message: `pagamento deve ser um dos seguintes valores: ${Object.values(Payments).toString()}`})
  @IsString()
  pagamento: Payments
}