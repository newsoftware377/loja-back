import { Injectable } from '@nestjs/common';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { ShopApp } from './ShopApp';
import { OrderApp } from './OrderApp';
import { ResumeToday } from '../types/report/ResumeToday';
import { ResumeMonth } from '../types/report/ResumeMonth';
import { calcTotalValue } from 'src/utils/calcTotal';

@Injectable()
export class ReportApp {
  constructor(
    private readonly shopApp: ShopApp,
    private readonly orderApp: OrderApp,
  ) { }

  public searchResumeToday = async (user: UserViewModel): Promise<ResumeToday[]> => {
    const shops = await this.shopApp.listShops(user);
    const ordersGroup = await this.orderApp.listOrdersTodayByList(
      shops.map((x) => x.lojaId),
    );

    const resume = ordersGroup.map<ResumeToday>(item => {
      let total = 0;
      let lastOrder = 0

      for (const order of item.orders) {
        total += calcTotalValue(order, order.produtos)
        const date = new Date(order.createdAt).valueOf()
        if (lastOrder < date) {
          lastOrder = date
        }
      }
      return {
        lojaId: item._id,
        total: total,
        ultimaCompra: new Date(lastOrder).toISOString()
      }
    }) 

    return resume;
  };

  public searchResumeMonth = async (id: string): Promise<ResumeMonth> => {
    const totalOnMonth = await this.orderApp.totalOnMonth(id)  
    const total = totalOnMonth[0]?.sum

    if (!total) {
      return {
        lojaId: id,
        totalMes: 0
      }
    }

   return {
      totalMes: total,
      lojaId: id
    }
  }

}
