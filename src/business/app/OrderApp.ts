import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CrateItem, CreateOrderDto } from '../types/order/CreateOrderDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../models/OrderModel';
import { Model } from 'mongoose';
import { Product } from '../models/ProductModel';
import { ProductCrate } from '../types/order/Product';
import { StockApp } from './StockApp';
import { calcTotalValue } from 'src/utils/calcTotal';

@Injectable()
export class OrderApp {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly stockApp: StockApp
  ) { }

  public createOrder = async (dto: CreateOrderDto, user: ShopViewModel) => {
    const { itens, comMudanca } = await this.stockApp.validateStock(dto.produtos, user.lojaId) 

    if (itens.every(x => x.qtd === 0)) {
      throw new BadRequestException('Todos os produdos estão fora de estoque')
    }

    const products = await this.getProducts(itens, user);

    const order = await this.orderModel.create({
      total: calcTotalValue(dto, products),
      desconto: dto.desconto,
      acressimo: dto.acressimo,
      clienteId: dto.clienteId,
      paraEntrega: dto.paraEntrega,
      pagamento: dto.pagamento,
      lojaId: user.lojaId,
      produtos: products,
    });

    await this.stockApp.reduceStock(itens, user.lojaId)
    return order 
  };

  public listOrders = async (user: ShopViewModel) => {
    const orders = await this.orderModel.find({ lojaId: user.lojaId });

    return orders;
  };

  public listOrdersToday = async (user: ShopViewModel) => {
    const date = new Date();
    date.setHours(0, 1);

    const orders = await this.orderModel.find({
      lojaId: user.lojaId,
      createdAt: { $gt: date.toISOString() } 
    });

    return orders;
  };

  public listOrdersTodayByList = async (shopIdLst: string[]): Promise<{ _id: string, orders: Order[]}[]> => {
    const date = new Date();
    date.setHours(0, 1);
    const orders = await this.orderModel.aggregate([
      { $match: {
        lojaId: { $in: shopIdLst },
        createdAt: { $gt: date.toISOString() } 
      }},
      { $group: {
        _id: '$lojaId',
        orders: { $push: "$$ROOT" }
      }}
    ]);

    return orders;
  };

  public totalOnMonth = async (lojaId: string) => {
    const date = new Date()
    date.setDate(1)
    date.setHours(0, 1)

    const ordersTotalSum = await this.orderModel.aggregate([
      { $match: { lojaId, createdAt: { $gt: date.toISOString() } }},
      { $group: { _id: null, sum: { $sum: '$total' }}},
      { $project: { _id: 0, sum: 1} }
    ]) 

    return ordersTotalSum
  }

  public listOrdersOnLastMonth = async (shopId: string) => {
    const initialDate = new Date();
    initialDate.setMonth(initialDate.getMonth() - 1)
    initialDate.setDate(1)
    initialDate.setHours(0, 0)

    const endDate = new Date()
    endDate.setDate(0)
    endDate.setHours(23, 0)

    const orders = await this.orderModel.find({
      lojaId: shopId,
      createdAt: { 
        $gt: initialDate.toISOString(),
        $lte: endDate.toISOString()
      }
    })

    return orders
  }

  private async getProducts(
    produtos: CrateItem[],
    user: ShopViewModel,
  ): Promise<ProductCrate[]> {
    const productsId = produtos.map((x) => x.id);
    const products = await this.productModel.find({
      $and: [{ lojaId: user.lojaId }, { _id: { $in: productsId } }],
    });

    if (products.length !== produtos.length) {
      const productNotFound = produtos.find((x) =>
        products.every((item) => item._id.toString() !== x.id),
      );
      throw new NotFoundException({
        message: 'Produto nao encontrado',
        error: `produto com o id ${productNotFound.id} nao encontrado`,
      });
    }

    return products.map((product) => {
      const qty = produtos.find((x) => x.id === product._id.toString())?.qtd;

      return {
        qtd: qty,
        nome: product.nome,
        preco: product.valorAtual,
        produtoId: product._id.toString(),
      };
    });
  }
}