import { OrderDocument, Product } from "src/business/models/OrderModel";
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
