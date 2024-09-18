import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BoxDocument = HydratedDocument<Box>

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
}

export const BoxSchema = SchemaFactory.createForClass(Box)
