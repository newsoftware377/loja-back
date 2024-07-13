import { ProductDocument } from "src/business/models/ProductModel";

export type ProductWithBarCode = ProductDocument & { codigoBarraImg: string }
