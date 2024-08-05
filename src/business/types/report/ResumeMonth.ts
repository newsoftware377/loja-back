import { Product } from "src/business/models/OrderModel";

export interface ResumeMonth {
  lojaId: string;
  totalMes: number
  maisVendido: Product
  menosVendido: Product
  concluido: boolean
  meta: number
}

export interface ResumeMonthWithCurrent extends ResumeMonth {
  metaAtual: number
  totalAtual: number
}
