import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
  @Prop({ required: true, type: String})
  nome: string
  
  @Prop({ required: true, type: String})
  lojaId: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
