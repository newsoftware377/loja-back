import { Body, Controller, Patch, Post } from '@nestjs/common';
import { BoxApp } from 'src/business/app/BoxApp';
import { OpenBoxDto } from 'src/business/types/box/OpenBoxDto';
import { AuthRequired } from 'src/utils/decorators/AuthDecorator';
import { User } from 'src/utils/decorators/User';
import { Roles } from 'src/utils/enums/Roles';
import { ShopViewModel } from '../viewModels/ShopViewModel';

@Controller('caixa')
export class BoxController {
  constructor(private readonly app: BoxApp) { }

  @AuthRequired([Roles.shop])
  @Post('abrir')
  async open(@Body() dto: OpenBoxDto, @User() user: ShopViewModel) {
    return this.app.open(dto, user);
  }

  @AuthRequired([Roles.shop])
  @Patch('fechar')
  async close(@User() user: ShopViewModel) {
    return this.app.close(user);
  }
}
