import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { BoxApp } from 'src/business/app/BoxApp';
import { OpenBoxDto } from 'src/business/types/box/OpenBoxDto';
import { AuthRequired } from 'src/utils/decorators/AuthDecorator';
import { User } from 'src/utils/decorators/User';
import { Roles } from 'src/utils/enums/Roles';
import { ShopViewModel } from '../viewModels/ShopViewModel';
import { UserViewModel } from '../viewModels/UserViewModel';
import { CreateExpenseDto } from 'src/business/types/box/CreateExpenseDto';
import { UpdateExpenseDto } from 'src/business/types/box/UpdateExpenseDto';

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

  @AuthRequired([Roles.user])
  @Get(':lojaId')
  async list(@User() user: UserViewModel, @Param('lojaId') shopId: string) {
    return this.app.list(shopId, user);
  }

  @AuthRequired([Roles.shop])
  @Post('loja/despesa')
  async createExpense(
    @User() user: ShopViewModel,
    @Body() body: CreateExpenseDto,
  ) {
    return this.app.createExpense(user, body);
  }

  @AuthRequired([Roles.shop])
  @Put('loja/despesa')
  async updateExpense(
    @User() user: ShopViewModel,
    @Body() body: UpdateExpenseDto,
  ) { 
    return this.app.updateExpense(user, body)
  }

  @AuthRequired([Roles.shop])
  @Get('loja/caixaAberto')
  async listExpenses(@User() user: ShopViewModel) {
    return this.app.getOpenedBox(user)
  }
}
