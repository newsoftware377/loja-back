import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BoxDocument = HydratedDocument<Box>

@Schema() 
export class Expense {
  @Prop({ type: String, required: true})
  titulo: string

  @Prop({ type: String, default: "" })
  descricao?: string

  @Prop({ type: Number, required: true})
  valor: number
}

@Schema()
export class Box {
  @Prop({ required: true, type: Number})
  valorInicial: number

  @Prop({ type: Number, default: 0 })
  valorFinal: number

  @Prop({ required: true, type: Date})
  dataAberto: Date

  @Prop({ type: Date})
  dataFechado: Date

  @Prop({ type: Boolean, default: true })
  aberto: boolean

  @Prop({ type: Number, default: 0 })
  valorPix: number

  @Prop({ type: Number, default: 0 })
  valorDinheiro: number;

  @Prop({ type: Number, default: 0 })
  valorCartao: number

  @Prop({ type: Number, default: 0 })
  qtdPedidos: number

  @Prop({ type: String, required: true})
  lojaId: string

  @Prop({ type: String, required: true})
  empresaId: string

  @Prop({ type: [Expense], default: []})
  despesas: Expense[]
}

export const BoxSchema = SchemaFactory.createForClass(Box)
