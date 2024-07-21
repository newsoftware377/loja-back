import { Injectable } from "@nestjs/common";
import { UpdateStockDto } from "../types/stock/UpdateStockDto";
import { ShopViewModel } from "src/api/viewModels/ShopViewModel";
import { InjectModel } from "@nestjs/mongoose";
import { Stock } from "../models/StockModel";
import { Model } from "mongoose";
import { mapToStockViewModel } from "src/api/viewModels/StockViewModel";
import { StockGatway } from "../gatways/StockGateway";
import { CrateItem } from "../types/order/CreateOrderDto";

interface StockValidationReturn {
  itens: CrateItem[]
  comMudanca: CrateItem[]
}

@Injectable()
export class StockApp {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
    private readonly stockGateway: StockGatway
  ) {}

  public updateStock = async (dto: UpdateStockDto[], user: ShopViewModel) => {
    const newStockPromises = dto.map(item => this.stockModel.findOneAndUpdate({
      $and: [
        { produtoId: item.produtoId },
        { lojaId: user.lojaId}
      ]
    }, { qtd: item.qtd  }, { new: true, upsert: true }))
    const newStock = await Promise.all(newStockPromises)

    this.stockGateway.notifyStockChanges(newStock.map(mapToStockViewModel))

    return newStock
  }

  public validateStock = async (products: CrateItem[]) => {
    const productsId = products.map(x => x.id)
    const stock = await this.stockModel.find({ produtoId: { $in: productsId }})

    return products.reduce((acc, product) => {
      const stockProduct = stock.find(x => x.produtoId === product.id) 
      if (!stockProduct) {
        acc.comMudanca.push({
          id: product.id,
          qtd: 0
        })
      } else if (stockProduct.qtd < product.qtd) {
        acc.comMudanca.push({
          id: product.id,
          qtd: stockProduct.qtd
        })
      } else {
        acc.itens.push({
          id: product.id,
          qtd: product.qtd
        })
      }

      return acc
    }, { itens: [], comMudanca: []} as StockValidationReturn)
  }

}
