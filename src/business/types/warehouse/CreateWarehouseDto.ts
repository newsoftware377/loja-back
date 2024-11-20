import { Type } from "class-transformer";
import { IsObject, IsString, ValidateNested } from "class-validator";
import { Address } from "../shared/AddressDto";

export class CreateWarehouseDto {
  @IsString()
  empresaId: string;

  @IsString()
  nome:  string

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  endereco: Address
}
