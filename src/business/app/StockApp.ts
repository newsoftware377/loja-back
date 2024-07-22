import { Injectable } from '@nestjs/common';
import { UpdateStockDto } from '../types/stock/UpdateStockDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Stock } from '../models/StockModel';
import { Model } from 'mongoose';
import { mapToStockViewModel } from 'src/api/viewModels/StockViewModel';
import { StockGatway } from '../gatways/StockGateway';
import { CrateItem } from '../types/order/CreateOrderDto';

interface StockValidationReturn {
  itens: CrateItem[];
  comMudanca: CrateItem[];
}

@Injectable()
export class StockApp {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
    private readonly stockGateway: StockGatway,
  ) { }

  public updateStock = async (dto: UpdateStockDto[], user: ShopViewModel) => {
    const newStockPromises = dto.map((item) =>
      this.stockModel.findOneAndUpdate(
        {
          $and: [{ produtoId: item.produtoId }, { lojaId: user.lojaId }],
        },
        { qtd: item.qtd, produtoId: item.produtoId },
        { new: true, upsert: true },
      ),
    );

    const newStock = await Promise.all(newStockPromises);
    this.stockGateway.notifyStockChanges(newStock.map(mapToStockViewModel));

    return newStock;
  };

  public validateStock = async (products: CrateItem[], shopId: string) => {
    const productsId = products.map((x) => x.id);
    const stock = await this.stockModel.find({
      produtoId: { $in: productsId },
      lojaId: shopId
    });

    return products.reduce(
      (acc, product) => {
        const stockProduct = stock.find((x) => x.produtoId === product.id);
        let qty = product.qtd;
        if (!stockProduct) {
          qty = 0;
        } else if (stockProduct.qtd < product.qtd) {
          qty = product.qtd;
        }

        acc.itens.push({
          id: product.id,
          qtd: qty,
        });

        if (qty !== product.qtd) {
          acc.comMudanca.push({
            id: product.id,
            qtd: qty,
          });
        }
        return acc;
      },
      { itens: [], comMudanca: [] } as StockValidationReturn,
    );
  };

  public reduceStock = async (items: CrateItem[], shopId: string) => {
    const itemsMap = new Map();
    const itemsId = [];

    items.forEach((item) => {
      itemsMap.set(item.id, item.qtd);
      itemsId.push(item.id);
    });

    const stock = await this.stockModel.find({
      produtoId: { $in: itemsId },
      lojaId: shopId,
    });

    const newStockPromises = stock.map((item) =>
      this.stockModel.findOneAndUpdate(
        {
          produtoId: item.produtoId,
          lojaId: shopId,
        },
        { qtd: item.qtd - itemsMap.get(item.produtoId) },
        { new: true }
      ),
    );

    const newStock = await Promise.all(newStockPromises)

    await this.stockGateway.notifyStockChanges(newStock.map(mapToStockViewModel));
  };
}
