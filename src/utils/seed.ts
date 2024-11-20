import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/business/models/ProductModel';
import { ProductShop } from 'src/business/models/ProductShopModel';
import { User } from 'src/business/models/UserModel';
import { Warehouse } from 'src/business/models/WareHouseModel';
import { Roles } from './enums/Roles';
import { HashService } from 'src/business/services/HashService';
import { parse } from 'path';

export class Seed {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<Warehouse>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductShop.name)
    private readonly productShopModel: Model<ProductShop>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: Logger,
    private readonly hashService: HashService,
  ) {
    this.populateProducts();
  }

  async populateProducts() {
    const users = await this.userModel.find();
    let warehouses = await this.warehouseModel.find();

    if (users.length !== warehouses.length) {
      const usersWithoutUsers = users.filter(
        (x) => !warehouses.some((w) => w.empresaId === x.empresaId),
      );
      this.logger.debug('usuarios sem deposito');
      await this.populateWarehouse(usersWithoutUsers);
    }

    warehouses = await this.warehouseModel.find();

    users.forEach(async (user) => {
      const warehouse = warehouses.find((x) => x.empresaId === user.empresaId);
      await this.productModel.updateMany(
        { empresaId: user.empresaId },
        { depositoId: warehouse.depositoId },
      );

      const products = await this.productModel.find({
        empresaId: user.empresaId,
      });

      const productsShop = await this.productShopModel.find({
        depositoId: warehouse.depositoId
      });

      const productsToUpdate = products.filter(
        (x) => !productsShop.some((y) => y.produtoId === x._id.toString()),
      );

      const productShop: ProductShop[] = productsToUpdate.map((x) => {
        return {
          depositoId: warehouse.depositoId,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          valorAtual: x.valorAtual,
          produtoId: x._id.toString(),
          lojaId: x.lojaId,
        };
      });

      await this.productShopModel.insertMany(productShop);
    });
  }

  async populateWarehouse(users: User[]) {
    const warehouse: Warehouse[] = users.map((x) => {
      const depositoId = this.hashService.createIdToWarehouse(1);

      return {
        nome: 'Deposito 1',
        cargo: Roles.warehouse,
        endereco: {
          endereco: '1',
          cep: '1',
          bairro: '1',
          cidade: '1',
          estado: '1',
          numero: 0,
        },
        empresaId: x.empresaId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        depositoId,
      };
    });
    await this.warehouseModel.insertMany(warehouse);
  }
}
