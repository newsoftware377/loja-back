import { Body, Controller, Get, Post } from "@nestjs/common";
import { User } from "src/utils/decorators/User";
import { ShopViewModel } from "../viewModels/ShopViewModel";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";
import { OrderApp } from "src/business/app/OrderApp";
import { CreateOrderDto } from "src/business/types/order/CreateOrderDto";
import { mapToOrderViewModel, OrderViewModel } from "../viewModels/OrderViewModel";

@Controller('pedido')
export class OrderController {
  constructor(
    private readonly app: OrderApp
  ){}

  @AuthRequired([Roles.shop])
  @Post('loja')
  async createOrder(@Body() body: CreateOrderDto, @User() user: ShopViewModel) {
    return this.app.createOrder(body, user).then(mapToOrderViewModel)
  }
  
  @AuthRequired([Roles.shop])
  @Get('loja/listarTodos')
  async listOrders(@User() user: ShopViewModel):Promise<OrderViewModel[]> {
    return this.app.listOrders(user).then(x => x.map(mapToOrderViewModel))
  }

  @AuthRequired([Roles.shop])
  @Get('loja/listarDeHoje')
  async listOrdersToday(@User() user: ShopViewModel):Promise<OrderViewModel[]> {
    return this.app.listOrdersToday(user).then(x => x.map(mapToOrderViewModel))
  }
}
