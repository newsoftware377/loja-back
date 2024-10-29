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
  ) {}

  public updateStock = async (dto: UpdateStockDto[], user: ShopViewModel) => {
    const newStockPromises = dto.map((item) =>
      this.stockModel.findOneAndUpdate(
        {
          $and: [{ produtoId: item.produtoId }, { lojaId: user.lojaId }],
        },
        {
          qtd: item.qtd,
          produtoId: item.produtoId,
          updatedAt: new Date().toISOString(),
        },
        { new: true, upsert: true },
      ),
    );

    const newStock = await Promise.all(newStockPromises);
    this.stockGateway.notifyStockChanges(newStock.map(mapToStockViewModel));

    return newStock;
  };

  public lessStock = async (dto: UpdateStockDto[], user: ShopViewModel) => {
    const currentStocksRegister = await this.stockModel.find({
      lojaId: user.lojaId,
      produtoId: { $in: dto.map((x) => x.produtoId) },
    });

    const stockLess = dto.map((item) => {
      const currentStock = currentStocksRegister.find(
        (x) => x.produtoId === item.produtoId,
      );

      const newQtd = (currentStock?.qtd || 0) - item.qtd;

      return {
        produtoId: item.produtoId,
        qtd: newQtd >= 0 ? newQtd : 0,
      };
    });

    const newStockPromises = stockLess.map((item) =>
      this.stockModel.findOneAndUpdate(
        {
          $and: [{ produtoId: item.produtoId }, { lojaId: user.lojaId }],
        },
        {
          qtd: item.qtd,
          produtoId: item.produtoId,
          updatedAt: new Date().toISOString(),
        },
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
      lojaId: shopId,
    });

    return products.reduce(
      (acc, product) => {
        const stockProduct = stock.find((x) => x.produtoId === product.id);
        const availableStock = stockProduct.qtd || 0;
        const qty = product.qtd;

        if (qty > availableStock) {
          acc.comMudanca.push({
            id: product.id,
            qtd: availableStock,
          });
        }

        acc.itens.push({
          id: product.id,
          qtd: product.qtd,
        });
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
          qtd: {
            $gt: 0,
          },
        },
        { qtd: item.qtd - itemsMap.get(item.produtoId) },
        { new: true },
      ),
    );

    const newStock = await Promise.all(newStockPromises);
    const newStockValid = newStock.filter(Boolean);

    await this.stockGateway.notifyStockChanges(
      newStockValid.map(mapToStockViewModel),
    );
  };

  public getProductStock = async (id: string, user: ShopViewModel) => {
    const stock = await this.stockModel.findOne({
      lojaId: user.lojaId,
      produtoId: id,
    });

    return {
      qtd: stock?.qtd || 0,
      produtoId: id,
    };
  };
}
