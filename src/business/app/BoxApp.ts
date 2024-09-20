import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OpenBoxDto } from '../types/box/OpenBoxDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Box, Expense } from '../models/BoxModel';
import { Model } from 'mongoose';
import { OrderApp } from './OrderApp';
import { Payments } from '../types/order/OrderPayments';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { CreateExpenseDto } from '../types/box/CreateExpenseDto';
import { UpdateExpenseDto } from '../types/box/UpdateExpenseDto';

@Injectable()
export class BoxApp {
  constructor(
    @InjectModel(Box.name) private readonly boxModel: Model<Box>,
    private readonly orderApp: OrderApp,
  ) { }

  public async open(dto: OpenBoxDto, user: ShopViewModel) {
    const now = new Date();
    const boxOpened = await this.boxModel.findOne({
      empresaId: user.empresaId,
      lojaId: user.lojaId,
      aberto: true,
    });

    if (boxOpened) {
      throw new BadRequestException(
        'Já existe um caixa aberto, feche-o antes de abrir outro',
      );
    }

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
    const openedBox = await this.boxModel.findOne({
      aberto: true,
    });
    const date = new Date(openedBox.dataAberto);
    const resume = await this.getResumeDay(user.lojaId, date);

    const box = await this.boxModel.findOneAndUpdate(
      {
        aberto: true,
        lojaId: user.lojaId,
        empresaId: user.empresaId,
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
    const boxes = await this.boxModel
      .find({
        lojaId: shopId,
        empresaId: user.empresaId,
      })
      .sort({ dataAberto: -1 });
    const openedBox = boxes.find((x) => x.aberto);
    const date = new Date(openedBox?.dataAberto);

    let resumeDay = {};
    if (openedBox) resumeDay = await this.getResumeDay(shopId, date);

    return boxes.map((x) => {
      const boxObj = x.toObject();

      if (boxObj.aberto) {
        return {
          ...boxObj,
          ...resumeDay,
        };
      }

      return {
        ...boxObj,
      };
    });
  };

  public createExpense = async (user: ShopViewModel, dto: CreateExpenseDto) => {
    await this.validateHasOpenedBox(user)

    const expense: Expense = {
      valor: dto.valor,
      titulo: dto.titulo,
      descricao: dto.descricao,
    };

    const newBox = await this.boxModel.findOneAndUpdate(
      {
        lojaId: user.lojaId,
        empresaId: user.empresaId,
        aberto: true,
      },
      {
        $push: { despesas: expense },
      },
      { new: true },
    );

    return newBox.toObject();
  };

  public updateExpense = async (
    user: ShopViewModel,
    dto: UpdateExpenseDto,
  ) => {
    await this.validateHasOpenedBox(user)

    const expense = {
      titulo: dto.titulo,
      descricao: dto.descricao,
      valor: dto.valor,
      _id: dto.id
    };

    const newBox = await this.boxModel.findOneAndUpdate(
      {
        lojaId: user.lojaId,
        empresaId: user.empresaId,
        aberto: true,
        "despesas._id": dto.id
      },
      {
        "despesas.$": expense 
      },
      { new: true },
    );

    return newBox.toObject();
  };

  public getOpenedBox = async (user: ShopViewModel) => {
    const box = await this.boxModel.findOne({
      lojaId: user.lojaId,
      empresaId: user.empresaId,
      aberto: true
    })

    return box.toObject()
  }

  private validateHasOpenedBox = async (user: ShopViewModel) => {
     const openedBox = await this.boxModel.find({
      lojaId: user.lojaId,
      empresaId: user.empresaId,
      aberto: true,
    });

    if (!openedBox) {
      throw new BadRequestException('Não tem nenhum caixa aberto no momento');
    }
  }

  private getResumeDay = async (shopId: string, date?: Date) => {
    const orders =
      (await this.orderApp.getOrdersMoreThatDate(shopId, date)) || [];

    const initialReduceValue = {
      valorFinal: 0,
      valorPix: 0,
      valorDinheiro: 0,
      valorCartao: 0,
      qtdPedidos: orders.length,
    };

    return orders.reduce((acc, order) => {
      const orderObj = order.toObject();
      switch (orderObj.pagamento) {
        case Payments.pix:
          acc.valorPix += orderObj.total;
          break;
        case Payments.cartao:
          acc.valorCartao += orderObj.total;
          break;
        case Payments.dinheiro:
          acc.valorDinheiro += orderObj.total;
          break;
      }

      acc.valorFinal += orderObj.total;
      return acc;
    }, initialReduceValue);
  };
}
