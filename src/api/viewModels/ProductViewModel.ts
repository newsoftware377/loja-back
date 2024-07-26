import { ProductWithCategory } from "src/business/types/product/Product"

export interface ProductViewModel {
  nome: string
  categoria: string
  categoriaId: string
  valorAtual: number
  valorOriginal: number
  codigoBarra: number
  qtdMinima: number
  id: string
} 

export const mapToProductViewModel = (product: ProductWithCategory): ProductViewModel => ({
  nome: product.nome,
  categoria: product.categoria,
  valorAtual: product.valorAtual,
  id: product._id.toString(),
  valorOriginal: product.valorOriginal,
  codigoBarra: product.codigoBarra,
  categoriaId: product.categoriaId,
  qtdMinima: product.qtdMinima
})
