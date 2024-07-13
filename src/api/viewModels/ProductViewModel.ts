import { ProductWithBarCode } from "src/business/types/product/Product"

export interface ProductViewModel {
  nome: string
  categoria: string
  valorAtual: number
  valorOriginal: number
  codigoBarraImg: string,
  codigoBarra: number
  id: string
} 

export const mapToProductViewModel = (product: ProductWithBarCode): ProductViewModel => ({
  nome: product.nome,
  categoria: product.categoria,
  valorAtual: product.valorAtual,
  id: product._id.toString(),
  valorOriginal: product.valorOriginal,
  codigoBarraImg: product.codigoBarraImg,
  codigoBarra: product.codigoBarra
})
