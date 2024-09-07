import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenBoxDto } from '../types/box/OpenBoxDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Box } from '../models/BoxModel';
import { Model } from 'mongoose';
import { OrderApp } from './OrderApp';
import { Payments } from '../types/order/OrderPayments';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';

@Injectable()
export class BoxApp {
  constructor(
    @InjectModel(Box.name) private readonly boxModel: Model<Box>,
    private readonly orderApp: OrderApp,
  ) { }

  public async open(dto: OpenBoxDto, user: ShopViewModel) {
    const now = new Date();

    const box = await this.boxModel.create({
      lojaId: user.lojaId,
      empresaId: user.empresaId,
      valorInicial: dto.valorInicial,
      dataAberto: now.toISOString(),
    });

    return box;
  }

  public async close(user: ShopViewModel) {
    const now = new Date();
    const resume = await this.getResumeDay(user.lojaId);

    const box = await this.boxModel.findOneAndUpdate(
      {
        aberto: true,
      },
      {
        aberto: false,
        dataFechado: now.toISOString(),
        valorFinal: resume.valorFinal,
        valorPix: resume.valorPix,
        valorDinheiro: resume.valorDinheiro,
        valorCartao: resume.valorCartao,
        qtdPedidos: resume.qtdPedidos,
      },
    );

    if (!box) {
      throw new NotFoundException('Nao existe caixa aberto atualmente');
    }

    return box;
  }

  public list = async (shopId: string, user: UserViewModel) => {
    const boxes = await this.boxModel.find({
      lojaId: shopId,
      empresaId: user.empresaId
    }) 

    return boxes.map(x => x.toObject())
  }

  private getResumeDay = async (shopId: string) => {
    const orders = await this.orderApp.getOrdersToday(shopId);

    const initialReduceValue = {
      valorFinal: 0,
      valorPix: 0,
      valorDinheiro: 0,
      valorCartao: 0,
      qtdPedidos: orders.length,
    };

    return orders.reduce((acc, order) => {
      switch (order.pagamento) {
        case Payments.pix:
          acc.valorPix += order.total;
          break;
        case Payments.cartao:
          acc.valorCartao += order.total;
          break;
        case Payments.dinheiro:
          acc.valorDinheiro += order.total;
          break;
      }

      acc.valorFinal += order.total;
      return acc;
    }, initialReduceValue);
  };
}
