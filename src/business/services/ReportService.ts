import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ReportApp } from "../app/ReportApp";

@Injectable()
export class ReportService {

  constructor(
    private readonly reportApp: ReportApp,
    private readonly logger: Logger
  ) {
    this.reportApp.validateHasReportOnCurrentMonth()
  }
  
  @Cron('0 0 0 1 * *')
  async handlerTriggerPopulateReport() {
    await this.reportApp.populateInfoReport()
    await this.reportApp.populateNewMonthReport()

    this.logger.debug('reports updated')
  }

}
