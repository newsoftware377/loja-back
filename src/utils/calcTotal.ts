import Decimal from "decimal.js";
import { Order } from "src/business/models/OrderModel";
import { CreateOrderDto } from "src/business/types/order/CreateOrderDto";
import { ProductCrate } from "src/business/types/order/Product";

export function calcTotalValue(dto: CreateOrderDto | Order, products: ProductCrate[]) {
    const othersValues = new Decimal(dto.acressimo || 0).minus(
      new Decimal(dto.desconto || 0),
    );

    const subtotal = products.reduce((acc, value) => {
      const itemTotalValue = new Decimal(value.preco).times(value.qtd);
      acc = acc.plus(itemTotalValue);

      return acc;
    }, othersValues);

    return subtotal.toNumber();
  }
