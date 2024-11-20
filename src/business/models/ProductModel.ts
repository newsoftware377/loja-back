import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {
  @Prop({ required: true, type: String})
  nome: string

  @Prop({ required: true, type: String})
  categoriaId: string

  @Prop({ required: true, type: Number})
  valorAtual: number

  @Prop({ required: true, type: Number})
  valorOriginal: number

  @Prop({ required: true, type: Number})
  valorCompra: number
  
  @Prop({ required: true, type: Number})
  codigoBarra: number

  @Prop({ required: true, type: String})
  empresaId: string  

  @Prop({ required: true, default: 0, type: Number})
  qtdMinima: number
   
  @Prop({ required: true, type: String})
  depositoId: string

  @Prop({ required: true, type: String})
  lojaId: string

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})

ProductSchema.pre('updateOne', function(next) {
  next()
})
