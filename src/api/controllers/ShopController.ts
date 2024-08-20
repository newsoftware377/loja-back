import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShopApp } from 'src/business/app/ShopApp';
import { CreateShopDto } from 'src/business/types/shop/CreateShopDto';
import { mapToShopViewModel, mapToShopWithAddressViewModel } from '../viewModels/ShopViewModel';
import { AuthRequired } from 'src/utils/decorators/AuthDecorator';
import { Roles } from 'src/utils/enums/Roles';
import { User } from 'src/utils/decorators/User';
import { UserViewModel } from '../viewModels/UserViewModel';
import { UpdateShopDto } from 'src/business/types/shop/UpdateShopDto';

@Controller('loja')
export class ShopController {
  constructor(private readonly app: ShopApp) { }

  @AuthRequired([Roles.admin])
  @Post('admin/criarLoja')
  async createShop(@Body() body: CreateShopDto) {
    return this.app.createShop(body).then(mapToShopWithAddressViewModel);
  }

  @AuthRequired([Roles.user])
  @Get('usuario/lista')
  async listShops(@User() user: UserViewModel) {
    return this.app
      .listShopsByUser(user)
      .then((x) => x.map(mapToShopWithAddressViewModel));
  }

  @AuthRequired([Roles.admin])
  @Get('admin/lista')
  async listAllShops() {
    return this.app.listAllShops().then(x => x.map(mapToShopViewModel))
  }

  @AuthRequired([Roles.admin])
  @Delete('admin/:id')
  async deleteShop(@Param('id') id: string) {
    return this.app.deletShop(id).then(mapToShopWithAddressViewModel);
  }

  @AuthRequired([Roles.admin])
  @Patch('admin/:id')
  async updateClient(@Body() body: UpdateShopDto, @Param('id') id: string) {
    return this.app.updateShop(body, id).then(mapToShopWithAddressViewModel);
  }

}
