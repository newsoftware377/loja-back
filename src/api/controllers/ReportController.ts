import { Controller, Get } from "@nestjs/common";
import { ReportApp } from "src/business/app/ReportApp";
import { User } from "src/utils/decorators/User";
import { UserViewModel } from "../viewModels/UserViewModel";

@Controller('relatorio')
export class ReportController {
  constructor(
    private readonly app: ReportApp
  ) {}

  @Get('usuario/resumo')
  async searchResume(@User() user: UserViewModel) {
    return this.app.searchResume(user)
  }
}

