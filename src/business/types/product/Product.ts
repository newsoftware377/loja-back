import { ProductDocument } from "src/business/models/ProductModel";

export type ProductWithCategory = ProductDocument & { categoria: string, produtoId: string }
