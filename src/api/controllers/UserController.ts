import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UserApp } from "src/business/app/UserApp";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";
import { mapToUserViewModel, UserViewModel } from "../viewModels/UserViewModel";
import { User } from "src/utils/decorators/User";
import { UpdateUserDto } from "src/business/types/auth/UpdateUserDto";

@Controller('usuario')
export class UserController {
  constructor(
    private readonly app: UserApp
  ) {}

  @AuthRequired([Roles.admin])
  @Get('admin')
  async listUsers() {
    return this.app.listUsers().then(x => x.map(mapToUserViewModel))
  }

  @AuthRequired([Roles.user])
  @Patch()
  async updateUser(@User() user: UserViewModel, @Body() body: UpdateUserDto) {
    return this.app.updateUser(user, body)
  }
}
