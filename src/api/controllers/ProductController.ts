import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProductApp } from "src/business/app/ProductApp";
import { CreateProductDto } from "src/business/types/product/CreateProductDt";
import { User } from "src/utils/decorators/User";
import { ShopViewModel } from "../viewModels/ShopViewModel";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";
import { mapToProductViewModel, ProductViewModel } from "../viewModels/ProductViewModel";
import { UpdateProductDto } from "src/business/types/product/UpdateProductDto";

@Controller('produto')
export class ProductController {
  constructor(
    private readonly app: ProductApp
  ) {}

  @AuthRequired([Roles.shop])
  @Post('loja')
  async createProduct(@Body() body: CreateProductDto, @User() shop: ShopViewModel) {
   return this.app.createProduct(body, shop).then(mapToProductViewModel)
  }

  @AuthRequired([Roles.shop, Roles.user])
  @Get('lista/:lojaId')
  async listProducts(@User() shop: ShopViewModel, @Param('lojaId') lojaId: string) {
    return this.app.listProducts(shop, lojaId).then(x => x.map(mapToProductViewModel))
  }

  @AuthRequired([Roles.shop])
  @Delete('loja/:id')
  async deleteClient(@User() user: ShopViewModel, @Param('id') id: string): Promise<ProductViewModel> {
    return this.app.deleteProduct(user, id).then(mapToProductViewModel)
  }

  @AuthRequired([Roles.shop])
  @Patch('loja/:id')
  async updateClient(@User() user: ShopViewModel, @Body() body: UpdateProductDto, @Param('id') id: string) {
    return this.app.updateProduct(user, body, id).then(mapToProductViewModel)
  }
};
