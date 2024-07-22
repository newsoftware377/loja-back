import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shop } from '../models/ShopModel';
import { Model } from 'mongoose';
import { CreateShopDto } from '../types/shop/CreateShopDto';
import { HashService } from '../services/HashService';
import { User } from '../models/UserModel';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { UpdateShopDto } from '../types/shop/UpdateShopDto';
import { UpdateGoal } from '../types/shop/UpdateGoal';

@Injectable()
export class ShopApp {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) { }

  public createShop = async (dto: CreateShopDto) => {
    const user = await this.userModel.findOne({ empresaId: dto.empresaId });
    if (!user) {
      throw new NotFoundException('ID da empresa incorreto');
    }

    const lojaId = this.hashService.createId(dto.nome);
    const shop = await this.shopModel.create({
      empresaId: dto.empresaId,
      cnpj: dto.cnpj,
      nome: dto.nome,
      endereco: dto.endereco,
      lojaId,
    });

    return shop;
  };

  public listShops = async (user: UserViewModel) => {
    const shops = await this.shopModel.find({
      empresaId: user.empresaId,
    });

    return shops ?? [];
  };

  public deletShop = async (id: string) => {
    const shop = await this.shopModel.findOneAndDelete({ _id: id });

    return shop;
  };

  public updateShop = async (dto: UpdateShopDto, id: string) => {
    const query = {
      _id: id,
    };
    const shop = await this.shopModel.findOne(query);

    const shopUpdated = await this.shopModel.findOneAndUpdate(
      query,
      {
        ...shop.toObject(),
        ...dto,
      },
      { new: true },
    );

    return shopUpdated;
  };

  public updateGoal = async (
    user: UserViewModel,
    id: string,
    dto: UpdateGoal,
  ) => {
    const shop = await this.shopModel.findOneAndUpdate(
      { lojaId: id, empresaId: user.empresaId },
      { metaDoMes: dto.metaDoMes },
      { new: true },
    );

    return shop
  };
}
