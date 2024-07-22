import { OrderDocument } from "src/business/models/OrderModel";
import { CrateItem } from "./CreateOrderDto";

export type CreateOrderResponse = OrderDocument & { comMudanca: CrateItem[] }
