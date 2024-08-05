import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
class ProductReport {
  qtd: number
  nome: string;
  produtoId: string
  preco: number
}

export type ReportDocument = HydratedDocument<Report>

@Schema()
export class Report {
  @Prop({ type: Number, required: true })
  meta: number;

  @Prop({ type: String, required: true })
  data: string;

  @Prop({ type: ProductReport})
  maisVendido: ProductReport;

  @Prop({ type: ProductReport})
  menosVendido: ProductReport

  @Prop({ type: Boolean, default: false})
  concluido: boolean

  @Prop({ type: String, required: true})
  lojaId: string

  @Prop({ type: Number})
  totalMes: number
}

export const ReportSchema = SchemaFactory.createForClass(Report)
