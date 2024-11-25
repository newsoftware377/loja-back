import { Body, Controller, Post } from "@nestjs/common";
import { WarehouseApp } from "src/business/app/WarehouseApp";
import { CreateWarehouseDto } from "src/business/types/warehouse/CreateWarehouseDto";

@Controller("deposito")
export class WarehouseController {
  constructor(private readonly app: WarehouseApp ) {}

  @Post()
  async createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.app.createWarehouse(dto)
  }
}
