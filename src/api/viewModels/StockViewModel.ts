import { StockDocument } from "src/business/models/StockModel";

export interface StockViewModel {
  id: string;
  qtd: number;
  atualizadoEm: string
  lojaId: string
}

export const mapToStockViewModel = (stock: StockDocument):StockViewModel => ({
  qtd: stock.qtd,
  id: stock.produtoId,
  atualizadoEm: stock.updatedAt,
  lojaId: stock.lojaId
})
