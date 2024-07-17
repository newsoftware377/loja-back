import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StockDocument = HydratedDocument<Stock>

@Schema()
export class Stock {
  @Prop({ required: true, type: String})
  produtoId: string

  @Prop({ required: true, type: Number})
  qtd: number

  @Prop({ rquired: true, type: String})
  lojaId: string

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const StockSchema = SchemaFactory.createForClass(Stock)

StockSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})


