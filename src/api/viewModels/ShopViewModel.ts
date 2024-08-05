import { ShopDocumnet } from "src/business/models/ShopModel"
import { Address } from "src/business/types/shared/Address"
import { Roles } from "src/utils/enums/Roles"

export interface ShopViewModel {
 nome: string
 lojaId: string
 empresaId: string
 id: string
 cnpj: string
 cargo: Roles
} 

export interface ShopWithAddressViewModel extends ShopViewModel {
  endereco: Address
}

export const mapToShopViewModel = (shop: ShopDocumnet): ShopViewModel => ({
  nome: shop.nome,
  empresaId: shop.empresaId,
  cnpj: shop.cnpj,
  lojaId: shop.lojaId,
  id: shop._id.toString(),
  cargo: shop.cargo
})

export const mapToShopWithAddressViewModel = (shop: ShopDocumnet): ShopWithAddressViewModel => ({
  ...mapToShopViewModel(shop),
  endereco: shop.endereco
})



