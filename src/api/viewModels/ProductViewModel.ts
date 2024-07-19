import { ProductWithBarCodeAndCategory } from "src/business/types/product/Product"

export interface ProductViewModel {
  nome: string
  categoria: string
  categoriaId: string
  valorAtual: number
  valorOriginal: number
  codigoBarraImg: string,
  codigoBarra: number
  id: string
} 

export const mapToProductViewModel = (product: ProductWithBarCodeAndCategory): ProductViewModel => ({
  nome: product.nome,
  categoria: product.categoria,
  valorAtual: product.valorAtual,
  id: product._id.toString(),
  valorOriginal: product.valorOriginal,
  codigoBarraImg: product.codigoBarraImg,
  codigoBarra: product.codigoBarra,
  categoriaId: product.categoriaId
})
