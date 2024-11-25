import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Warehouse } from "src/business/models/WareHouseModel";
import { HashService } from "src/business/services/HashService";
import { CreateWarehouseDto } from "src/business/types/warehouse/CreateWarehouseDto";

@Injectable()
export class WarehouseApp {
  constructor(
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<Warehouse>,
    private readonly hashService: HashService
  ) {}

  public createWarehouse = async (dto: CreateWarehouseDto) => {
    const count = await this.warehouseModel.countDocuments({ empresaId: dto.empresaId })

    const depositoId = this.hashService.createIdToWarehouse(count)

    const warehouse = await this.warehouseModel.create({
      empresaId: dto.empresaId,
      nome: dto.nome,
      endereco: dto.endereco,
      depositoId
    })

    return warehouse.toJSON()
  }
}
