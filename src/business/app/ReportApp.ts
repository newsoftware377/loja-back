import { Injectable, Logger } from '@nestjs/common';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { ShopApp } from './ShopApp';
import { OrderApp } from './OrderApp';
import { ResumeToday } from '../types/report/ResumeToday';
import { ResumeMonth } from '../types/report/ResumeMonth';
import { calcTotalValue } from 'src/utils/calcTotal';
import { Product } from '../models/OrderModel';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../models/ReportModel';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReportApp {
  constructor(
    private readonly shopApp: ShopApp,
    private readonly orderApp: OrderApp,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    private readonly logger: Logger
  ) { }

  public searchResumeToday = async (
    user: UserViewModel,
  ): Promise<ResumeToday[]> => {
    const shops = await this.shopApp.listShopsByUser(user);
    const ordersGroup = await this.orderApp.listOrdersTodayByList(
      shops.map((x) => x.lojaId),
    );

    const resume = ordersGroup.map<ResumeToday>((item) => {
      let total = 0;
      let lastOrder = 0;

      for (const order of item.orders) {
        total += calcTotalValue(order, order.produtos);
        const date = new Date(order.createdAt).valueOf();
        if (lastOrder < date) {
          lastOrder = date;
        }
      }
      return {
        lojaId: item._id,
        total: total,
        ultimaCompra: new Date(lastOrder).toISOString(),
      };
    });

    return resume;
  };

  public updateMonthGoal = async (shopId: string, goal: number) => {
    const report = await this.reportModel.findOneAndUpdate(
      {
        lojaId: shopId,
        concluido: false,
      },
      { meta: goal },
      { new: true },
    );

    return report;
  };

  public searchResumeMonth = async (
    shopId: string,
  ): Promise<ReportDocument> => {
    const initialDate = new Date();
    initialDate.setMonth(initialDate.getMonth() - 1);
    initialDate.setDate(1);
    initialDate.setHours(0, 0);

    const endDate = new Date();
    endDate.setDate(0);
    endDate.setHours(23, 0);

    const report = await this.reportModel.findOne({
      lojaId: shopId,
      createdAt: {
        $gt: initialDate.toISOString(),
        $lte: endDate.toISOString(),
      },
    });

    return report;
  };

  public populateInfoReport = async () => {
    const undoneReports = await this.reportModel.find({ concluido: false });
    const chunkCount = 100;

    async function populateByChunk(start = 0, end = chunkCount) {
      const promises = undoneReports
        .slice(start, end)
        .map(async ({ lojaId }) => {
          const resume = await this.getResumedReport(lojaId);
          const report = await this.reportModel.updateOne({ lojaId }, resume, {
            new: true,
          });
          return report;
        });

        await Promise.all(promises)
        populateByChunk(start + chunkCount, end + chunkCount)
    }

    populateByChunk()
  };

  public populateNewMonthReport = async () => {
    const report = await this.reportModel.findOne({ concluido: false });

    if (report) return;

    const shops = await this.shopApp.listAllShops();
    const shopIds = shops.map((x) => x.lojaId);
    const date = new Date().toISOString()

    const data = shopIds.map((x) => ({
      meta: 0,
      lojaId: x,
      concluido: false,
      data: date
    }));
    await this.reportModel.insertMany(data);

    this.logger.debug('New month was populated')
  };
  
  public validateHasReportOnCurrentMonth = async () => {
    const initialDate = new Date();
    initialDate.setDate(1);
    initialDate.setHours(0, 0);

    const endDate = new Date();
    initialDate.setMonth(initialDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 0);

    const report = await this.reportModel.findOne({
      createdAt: {
        $gt: initialDate.toISOString(),
        $lte: endDate.toISOString(),
      },
    });

    if (!report) {
      await this.populateNewMonthReport()
      this.logger.debug('Month was populated')
    }

  }

  private getResumedReport = async (shopId: string) => {
    const orders = await this.orderApp.listOrdersOnLastMonth(shopId);

    const productsMap = new Map<string, Product>();
    const resume = orders.reduce(
      (acc, order) => {
        order.produtos.forEach((product) => {
          if (productsMap.get(product.produtoId)) {
            productsMap.set(product.produtoId, {
              ...product,
              qtd: productsMap.get(product.produtoId).qtd + product.qtd,
            });
          } else {
            productsMap.set(product.produtoId, product);
          }
        });

        acc.totalMes += order.total;
        return acc;
      },
      { concluido: true } as ResumeMonth,
    );

    Array.from(productsMap.values()).forEach((product) => {
      if (product.qtd > resume.maisVendido?.qtd) {
        resume.maisVendido = product;
      } else if (product.qtd < resume.menosVendido?.qtd) {
        resume.menosVendido = product;
      }
    });
    return resume;
  };

}
