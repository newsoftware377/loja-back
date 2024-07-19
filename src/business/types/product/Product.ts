import { ProductDocument } from "src/business/models/ProductModel";

export type ProductWithBarCodeAndCategory = ProductDocument & { codigoBarraImg: string, categoria: string }
