import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductApp } from 'src/business/app/ProductApp';
import { CreateProductDto } from 'src/business/types/product/CreateProductDt';
import { User } from 'src/utils/decorators/User';
import { ShopViewModel } from '../viewModels/ShopViewModel';
import { AuthRequired } from 'src/utils/decorators/AuthDecorator';
import { Roles } from 'src/utils/enums/Roles';
import {
  mapToProductViewModel,
  mapToProductWithQtyViewModel,
  ProductViewModel,
} from '../viewModels/ProductViewModel';
import { UpdateProductDto } from 'src/business/types/product/UpdateProductDto';
import { CreateCategoryDto } from 'src/business/types/product/CreateCategoryDto';
import { mapToCategoryViewModel } from '../viewModels/CategoryViewModel';
import { UserViewModel } from '../viewModels/UserViewModel';
import { ListProductsDto } from 'src/business/types/product/ListProductsDto';

@Controller('produto')
export class ProductController {
  constructor(private readonly app: ProductApp) {}

  @AuthRequired([Roles.shop])
  @Post('loja')
  async createProduct(
    @Body() body: CreateProductDto,
    @User() shop: ShopViewModel,
  ) {
    return this.app.createProduct(body, shop).then(mapToProductViewModel);
  }

  @AuthRequired([Roles.shop, Roles.user])
  @Get('lista/:lojaId')
  async listProducts(
    @User() shop: ShopViewModel | UserViewModel,
    @Param('lojaId') lojaId: string,
    @Query() params: ListProductsDto,
  ) {
    return this.app
      .listProductsToShop(shop, lojaId, params)
      .then((x) => x.map(mapToProductWithQtyViewModel));
  }

  @AuthRequired([Roles.shop])
  @Get('lista')
  async listProductsShop(
    @User() shop: ShopViewModel,
    @Query() params: ListProductsDto,
  ) {
    return this.app
      .listProductsToShop(shop, shop.lojaId, params)
      .then((x) => x.map(mapToProductWithQtyViewModel));
  }

  @AuthRequired([Roles.user])
  @Get('listaDaEmpresa')
  async listProductsByBusiness(@User() shop: UserViewModel) {
    return this.app.listProductsByBusiness(shop);
  }

  @AuthRequired([Roles.shop])
  @Delete('loja/:id')
  async deleteProduct(
    @User() user: ShopViewModel,
    @Param('id') id: string,
  ): Promise<ProductViewModel> {
    return this.app.deleteProduct(user, id).then(mapToProductViewModel);
  }

  @AuthRequired([Roles.shop])
  @Patch('loja/:id')
  async updateProduct(
    @User() user: ShopViewModel,
    @Body() body: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.app.updateProduct(user, body, id).then(mapToProductViewModel);
  }

  @AuthRequired([Roles.shop])
  @Post('loja/categoria')
  async createCategory(
    @User() user: ShopViewModel,
    @Body() body: CreateCategoryDto,
  ) {
    return this.app.createCategory(user, body).then(mapToCategoryViewModel);
  }

  @AuthRequired([Roles.shop, Roles.user])
  @Get('categoria/:lojaId')
  async listCategories(@Param('lojaId') lojaId: string) {
    return this.app
      .listCategories(lojaId)
      .then((x) => x.map(mapToCategoryViewModel));
  }

  @AuthRequired([Roles.shop])
  @Get('categoria')
  async listCategoriesShop(@User() user: ShopViewModel) {
    return this.app
      .listCategories(user.lojaId)
      .then((x) => x.map(mapToCategoryViewModel));
  }

  @AuthRequired([Roles.shop])
  @Patch('loja/categoria/:id')
  async updateCategory(
    @Body() body: CreateCategoryDto,
    @User() user: ShopViewModel,
    @Param('id') categoryId: string,
  ) {
    return this.app
      .updateCategoryName(body, categoryId, user)
      .then(mapToCategoryViewModel);
  }

  @AuthRequired([Roles.shop])
  @Delete('loja/categoria/:id')
  async deleteCategory(
    @Param('id') categoryId: string,
    @User() user: ShopViewModel,
  ) {
    return this.app
      .deleteCategory(categoryId, user)
      .then(mapToCategoryViewModel);
  }

  @AuthRequired([Roles.shop])
  @Patch('loja/removerPromocao/:id')
  async undoPromotion(@Param('id') id: string, @User() user: ShopViewModel) {
    return this.app.undoPromotion(id, user);
  }
}
