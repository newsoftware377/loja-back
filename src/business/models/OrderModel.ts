import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose";
import { Payments } from "../types/order/OrderPayments";

@Schema()
export class Product {
  nome: string;
  qtd: number
  preco: number
  produtoId: string
}

export type OrderDocument = HydratedDocument<Order>

@Schema()
export class Order {
  @Prop({ type: String })
  clienteId?: string

  @Prop({ type: [Product], required: true })
  produtos: Product[]

  @Prop({ type: Boolean, default: false })
  paraEntrega: boolean

  @Prop({ type: Number, default: 0 })
  acressimo: number

  @Prop({ type: Number, default: 0 })
  desconto: number

  @Prop({ type: Number, required: true,})
  total: number

  //@Prop({ required: true, type: String, enum: Object.values(Payments) })
  pagamento: Payments

  @Prop({ required: true, type: String })
  lojaId: string

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})


