import { ResumeMonth, ResumeMonthWithCurrent } from "src/business/types/report/ResumeMonth";

export interface ReportViewModel extends Omit<ResumeMonth, 'concluido'> {
  totalUltimoMes: number;
  metaUltimoMes: number
}

export const mapToReportViewModel = (report: ResumeMonthWithCurrent): ReportViewModel => ({
  totalMes: report.totalAtual,
  meta: report.metaAtual,
  lojaId: report.lojaId,
  metaUltimoMes: report?.meta,
  totalUltimoMes: report?.totalMes,
  maisVendido: report?.maisVendido,
  menosVendido: report?.menosVendido
})
