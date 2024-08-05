import { Controller, Get } from "@nestjs/common";
import { UserApp } from "src/business/app/UserApp";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";
import { mapToUserViewModel } from "../viewModels/UserViewModel";

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
}
