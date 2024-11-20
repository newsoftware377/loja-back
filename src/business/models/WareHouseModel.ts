import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AddressSchemaClass } from './shared/AddressSchema';
import { Roles } from 'src/utils/enums/Roles';

export type WarehouseDocumnet = HydratedDocument<Warehouse>;

@Schema()
export class Warehouse {
  @Prop({ required: true, type: String })
  nome: string;

  @Prop({ required: true, type: AddressSchemaClass })
  endereco: AddressSchemaClass;

  @Prop({ required: true, type: String })
  empresaId: string;

  @Prop({ required: true, type: String })
  depositoId: string;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;

  @Prop({
    required: true,
    default: Roles.warehouse,
    enum: Object.values(Roles),
    type: String,
  })
  cargo: Roles;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

WarehouseSchema.pre('save', function(next) {
  const date = new Date().toISOString();
  this.createdAt = date;
  this.updatedAt = date;
  next();
});
