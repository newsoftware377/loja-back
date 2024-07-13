import { ShopDocumnet } from "src/business/models/ShopModel"
import { Address } from "src/business/types/shared/Address"

export interface ShopViewModel {
 nome: string
 lojaId: string
 empresaId: string
 id: string
 cnpj: string
} 

export interface ShopWithAddressViewModel extends ShopViewModel {
  endereco: Address
}

export const mapToShopWithAddressViewModel = (shop: ShopDocumnet): ShopWithAddressViewModel => ({
  nome: shop.nome,
  empresaId: shop.empresaId,
  cnpj: shop.cnpj,
  lojaId: shop.lojaId,
  id: shop._id.toString(),
  endereco: shop.endereco
})


export const mapToShopViewModel = (shop: ShopDocumnet): ShopViewModel => ({
  nome: shop.nome,
  empresaId: shop.empresaId,
  cnpj: shop.cnpj,
  lojaId: shop.lojaId,
  id: shop._id.toString(),
})

