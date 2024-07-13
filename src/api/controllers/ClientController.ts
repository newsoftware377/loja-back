import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { User } from "src/utils/decorators/User";
import { Roles } from "src/utils/enums/Roles";
import { ShopViewModel } from "../viewModels/ShopViewModel";
import { ClientApp } from "src/business/app/ClientApp";
import { CreateClientDto } from "src/business/types/client/CreateClientDto";
import { ClientViewModel, mapToClientViewModel } from "../viewModels/ClientViewModel";
import { UpdateClientDto } from "src/business/types/client/UpdateClientDto";

@Controller('cliente')
export class ClientController {
  constructor(
    private readonly app: ClientApp
  ) {}

  @AuthRequired([Roles.shop])
  @Post('loja')
  async createClient(@Body() body: CreateClientDto, @User() user: ShopViewModel) {
    return this.app.createClient(body, user).then(mapToClientViewModel)
  }

  @AuthRequired([Roles.shop])
  @Get('loja/lista')
  async listClients(@User() user: ShopViewModel): Promise<ClientViewModel[]> {
    return this.app.listClients(user).then(x => x.map(mapToClientViewModel))
  }

  @AuthRequired([Roles.shop])
  @Delete('loja/:id')
  async deleteClient(@User() user: ShopViewModel, @Param('id') id: string): Promise<ClientViewModel> {
    return this.app.deleteClient(user, id).then(mapToClientViewModel)
  }

  @AuthRequired([Roles.shop])
  @Patch('loja/:id')
  async updateClient(@User() user: ShopViewModel, @Body() body: UpdateClientDto, @Param('id') id: string) {
    return this.app.updateClient(user, body, id).then(mapToClientViewModel)
  }
}
