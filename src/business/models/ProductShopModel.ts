import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductShopDocument = HydratedDocument<ProductShop>

@Schema()
export class ProductShop {
  @Prop({ required: true, type: Number})
  valorAtual: number

  @Prop({ required: true, type: String})
  lojaId: string  

  @Prop({ required: true, type: String})
  depositoId: string

  @Prop({ required: true, type: String})
  produtoId: string

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const ProductShopSchema = SchemaFactory.createForClass(ProductShop)

ProductShopSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})

ProductShopSchema.pre('updateOne', function(next) {
  next()
})
