import { ProductDocument } from "src/business/models/ProductModel";

export type ProductWithCategoryAndValue = ProductDocument & {
  categoria: string;
  produtoId: string;
  valorAtual: number
}
