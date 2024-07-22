import { Controller, Get, Param } from "@nestjs/common";
import { ReportApp } from "src/business/app/ReportApp";
import { User } from "src/utils/decorators/User";
import { UserViewModel } from "../viewModels/UserViewModel";
import { AuthRequired } from "src/utils/decorators/AuthDecorator";
import { Roles } from "src/utils/enums/Roles";

@Controller('relatorio')
export class ReportController {
  constructor(
    private readonly app: ReportApp
  ) {}

  @AuthRequired([Roles.user])
  @Get('usuario/resumoDoDia')
  async searchResume(@User() user: UserViewModel) {
    return this.app.searchResumeToday(user)
  }

  @AuthRequired([Roles.user])
  @Get('usuario/resumoDoMes/:lojaId')
  async searchResumeMonth(@Param('lojaId') id: string) {
    return this.app.searchResumeMonth(id)
  }
}

