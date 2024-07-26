import { ProductWithCategory } from "./Product";

export interface ListAllProducts {
  lojaId: string;
  products: ProductWithCategory[]
}
