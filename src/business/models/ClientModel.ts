import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AddressSchemaClass } from "./shared/AddressSchema";
import { HydratedDocument } from "mongoose";

export type ClientDocument = HydratedDocument<Client>

@Schema()
export class Client {
  @Prop({ type: String, required: true})
  nome: string

  @Prop({ type: Number, required: true})
  telefone: number

  @Prop({ type: String, required: true})
  cpf: string

  @Prop({ type: AddressSchemaClass, required: true})
  endereco: AddressSchemaClass

  @Prop({ required: true, type: String})
  empresaId: string  
   
  @Prop({ required: true, type: String})
  lojaId: string

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const ClientSchema = SchemaFactory.createForClass(Client);
