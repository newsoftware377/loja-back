import { Prop, Schema } from "@nestjs/mongoose"
import { Address } from "src/business/types/shared/Address"

@Schema()
export class AddressSchemaClass implements Address {
  @Prop({ required: true, type: String})
  endereco: string
  
  @Prop({ required: true, type: String})
  bairro: string

  @Prop({ required: true, type: String})
  cidade: string

  @Prop({ required: true, type: String})
  estado: string

  @Prop({ required: true, type: String})
  cep: string
  
  @Prop({ required: true, type: Number})
  numero: number
}

