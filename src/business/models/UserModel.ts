import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Roles } from "src/utils/enums/Roles";

export type UserDocumnet = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true, type: String })
  nome: string

  @Prop({ required: true, unique: true, type: String})
  email: string

  @Prop({ required: true, type: String})
  senha: string

  @Prop({ required: true, type: Number})
  telefone: number

  @Prop({ required: true, unique: true, type: String})
  empresaId: string

  @Prop({ required: true, default: 'user'})
  cargo: Roles

  @Prop({ type: String})
  createdAt: string

  @Prop({ type: String})
  updatedAt: string
}

export const UserSchema = SchemaFactory.createForClass(User);
