import { Body, Controller, Post } from "@nestjs/common";
import { AuthApp } from "src/business/app/AuthApp";
import { AuthAdminDto } from "src/business/types/auth/AuthAdminDto";
import { CreateUserDto } from "src/business/types/auth/CreateUserDto";
import { mapToUserViewModel, UserViewModel } from "../viewModels/UserViewModel";
import { AuthShopDto } from "src/business/types/auth/AuthShopDto";
import { ChangePasswordDto } from "src/business/types/auth/ChangePasswordDto";
import { AuthWarehouseDto } from "src/business/types/auth/AuthWarehouseDto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly app: AuthApp
  ) {}
  
  //@AuthRequired([Roles.admin])
  @Post('admin/criarUsuario')
  async createUser(@Body() body: CreateUserDto): Promise<UserViewModel> {
    return this.app.createUser(body).then(x => mapToUserViewModel(x))
  }

  @Post('usuario/login')
  async adminLogin(@Body() body: AuthAdminDto) {
    return this.app.adminLogin(body)
  }

  @Post('deposito/login')
  async warehouseLogin(@Body() body: AuthWarehouseDto) {
    return this.app.warehouseLogin(body)
  }

  @Post('loja/login')
  async shopLogin(@Body() body: AuthShopDto) {
    return this.app.shopLogin(body)
  }

  @Post('admin/mudarSenha')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.app.changePassword(body)
  }

}
