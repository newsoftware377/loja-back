import { Injectable } from '@nestjs/common';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { ShopApp } from './ShopApp';
import { OrderApp } from './OrderApp';
import { Resume } from '../types/report/Resume';

@Injectable()
export class ReportApp {
  constructor(
    private readonly shopApp: ShopApp,
    private readonly orderApp: OrderApp,
  ) { }

  public searchResume = async (user: UserViewModel) => {
    const shops = await this.shopApp.listShops(user);
    const orders = await this.orderApp.listOrdersTodayByList(
      shops.map((x) => x._id.toString()),
    );

    const resume = orders.reduce<Resume[]>((acc, order) => {
      const orderIndexOf = acc.findIndex((r) => r.lojaId === order.lojaId);
      if (orderIndexOf !== -1) {
        const resumeOrder = acc[orderIndexOf];
        const isLastSeller = new Date(order.createdAt) > new Date(resumeOrder.ultimaCompra);
        const ultimaCompra = isLastSeller ? order.createdAt : resumeOrder.ultimaCompra;

        acc[orderIndexOf] = {
          totalNoDia: order.total + resumeOrder.totalNoDia,
          lojaId: order.lojaId,
          ultimaCompra,
        };
      } else {
        acc.push({
          ultimaCompra: order.createdAt,
          lojaId: order.lojaId,
          totalNoDia: order.total,
        });
      }
      return acc;
    }, [] as Resume[]);

    return resume;
  };
}
