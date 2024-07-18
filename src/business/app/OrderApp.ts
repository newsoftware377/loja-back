import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../types/order/CreateOrderDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../models/OrderModel';
import { Model } from 'mongoose';
import { Product } from '../models/ProductModel';
import { ProductCrate } from '../types/order/Product';
import Decimal from 'decimal.js';

@Injectable()
export class OrderApp {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }

  public createOrder = async (dto: CreateOrderDto, user: ShopViewModel) => {
    const products = await this.getProducts(dto, user);

    const order = await this.orderModel.create({
      total: this.calcTotalValue(dto, products),
      desconto: dto.desconto,
      acressimo: dto.acressimo,
      clienteId: dto.clienteId,
      paraEntrega: dto.paraEntrega,
      pagamento: dto.pagamento,
      lojaId: user.lojaId,
      produtos: products,
    });

    return order;
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
      createdAt: { $gte: date },
    });

    return orders;
  };

  public listOrdersTodayByList = async (shopIdLst: string[]) => {
    const date = new Date();
    date.setHours(0, 1);
    const orders = await this.orderModel.find({
      lojaId: { $in: shopIdLst },
      createdAt: { $gte: date },
    });

    return orders;
  };

  private calcTotalValue(dto: CreateOrderDto, products: ProductCrate[]) {
    const othersValues = new Decimal(dto.acressimo || 0).minus(
      new Decimal(dto.desconto || 0),
    );

    const subtotal = products.reduce((acc, value) => {
      const itemTotalValue = new Decimal(value.preco).times(value.qtd);
      acc = acc.plus(itemTotalValue);

      return acc;
    }, othersValues);
    console.log(subtotal);

    return subtotal.toNumber();
  }

  private async getProducts(
    { produtos }: CreateOrderDto,
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
        id: product._id.toString(),
      };
    });
  }
}
