import { Injectable } from "@nestjs/common";
import { UpdateStockDto } from "../types/stock/UpdateStockDto";
import { ShopViewModel } from "src/api/viewModels/ShopViewModel";
import { InjectModel } from "@nestjs/mongoose";
import { Stock } from "../models/StockModel";
import { Model } from "mongoose";
import { mapToStockViewModel } from "src/api/viewModels/StockViewModel";
import { StockGatway } from "../gatways/StockGateway";

@Injectable()
export class StockApp {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
    private readonly stocGatway: StockGatway
  ) {}

  public updateStock = async (dto: UpdateStockDto[], user: ShopViewModel) => {
    const newStockPromises = dto.map(item => this.stockModel.findOneAndUpdate({
      $and: [
        { produtoId: item.produtoId },
        { lojaId: user.lojaId}
      ]
    }, { qtd: item.qtd  }, { new: true, upsert: true }))
    const newStock = await Promise.all(newStockPromises)

    this.stocGatway.notifyStockChanges(newStock.map(mapToStockViewModel))

    return newStock
  }
}
