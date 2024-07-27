import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'
import { AddressSchemaClass } from "./shared/AddressSchema";
import { Roles } from "src/utils/enums/Roles";

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

  @Prop({ type: Number, default: 0})
  metaDoMes?: number

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string

  @Prop({ required: true, default: Roles.shop, enum: Object.values(Roles), type: String })
  cargo: Roles
}

export const ShopSchema = SchemaFactory.createForClass(Shop)

ShopSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date 
  this.updatedAt = date
  next()
})


