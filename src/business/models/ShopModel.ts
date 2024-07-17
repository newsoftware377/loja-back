import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'
import { AddressSchemaClass } from "./shared/AddressSchema";

export type ShopDocumnet = HydratedDocument<Shop>

@Schema()
export class Shop {
  @Prop({ required: true, type: String})
  nome: string

  @Prop({ required: true, type: AddressSchemaClass })
  endereco: AddressSchemaClass

  @Prop({ required: true, type: String})
  empresaId: string

  @Prop({ required: true, type: String})
  lojaId: string

  @Prop({ required: true, type: String})
  cnpj: string

  @Prop({ type: Number})
  metaDoMes?: number

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const ShopSchema = SchemaFactory.createForClass(Shop)

ShopSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})


