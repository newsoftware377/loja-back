import { ProductWithBarCodeAndCategory } from "./Product";

export interface ListAllProducts {
  lojaId: string;
  products: ProductWithBarCodeAndCategory[]
}
