import { OrderDocument, Product } from "src/business/models/OrderModel";
import { CrateItem } from "src/business/types/order/CreateOrderDto";
import { CreateOrderResponse } from "src/business/types/order/CreateOrderResponse";
import { Payments } from "src/business/types/order/OrderPayments";

export interface OrderViewModel {
  produtos: Product[];
  id: string;
  pagamento: Payments
  total: number;
  desconto?: number;
  acressimo?: number;
  lojaId: string;
  paraEntrega: boolean
  clienteId?: string
  criadoEm: string
}

export interface CreateOrderViewModel extends OrderViewModel {
 comMudanca: CrateItem[]
}

export const mapToOrderViewModel = (order: OrderDocument): OrderViewModel => ({
  criadoEm: order.createdAt,
  lojaId: order.lojaId,
  clienteId: order.clienteId,
  paraEntrega: order.paraEntrega,
  id: order._id.toString(),
  total: order.total,
  produtos: order.produtos,
  pagamento: order.pagamento,
  desconto: order.desconto,
  acressimo: order.acressimo
})

export const mapToCreateOrderViewModel = (order: CreateOrderResponse): CreateOrderViewModel => ({
  ...mapToOrderViewModel(order),
  comMudanca: order.comMudanca
})
