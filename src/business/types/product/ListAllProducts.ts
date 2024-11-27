import { ProductWithCategoryAndValue } from "./Product";

export interface ListAllProducts {
  lojaId: string;
  products: ProductWithCategoryAndValue[]
}
