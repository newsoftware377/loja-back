import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { UpdateStockDto } from "src/business/types/stock/UpdateStockDto";
import { User } from "src/utils/decorators/User";
import { ShopViewModel } from "../viewModels/ShopViewModel";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";
import { StockApp } from "src/business/app/StockApp";
import { mapToStockViewModel, StockViewModel } from "../viewModels/StockViewModel";

@Controller('estoque')
export class StockController {
  constructor(
    private readonly app: StockApp
  ) {}

  @AuthRequired([Roles.shop])
  @Patch('loja')
  async updateStock(@Body() body: UpdateStockDto[], @User() user: ShopViewModel): Promise<StockViewModel[]> {
    return this.app.updateStock(body, user).then(x => x.map(mapToStockViewModel))
  }

  @AuthRequired([Roles.shop])
  @Get('loja/:id')
  async getProductStock(@Param('id') id: string, @User() user: ShopViewModel) {
    return this.app.getProductStock(id, user)
  }
}
