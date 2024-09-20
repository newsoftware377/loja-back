import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

export class UpdateExpenseDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string

  @IsNumber()
  @IsPositive()
  valor: number

  @IsMongoId()
  id: string
}

//export class UpdateExpenseDto {
//  @Type(() => Expense)
//  @IsArray()
//  @ValidateNested({ each: true })
//  despesas: Expense[]
//}
