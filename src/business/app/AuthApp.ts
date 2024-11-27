import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/UserModel";
import { Model } from "mongoose";
import { CreateUserDto } from "../types/auth/CreateUserDto";
import { AuthAdminDto } from "../types/auth/AuthAdminDto";
import { HashService } from "../services/HashService";
import { Shop } from "../models/ShopModel";
import { AuthShopDto } from "../types/auth/AuthShopDto";
import { JWTService } from "../services/JWTService";
import { mapToUserViewModel, UserViewModel } from "src/api/viewModels/UserViewModel";
import { mapToShopViewModel } from "src/api/viewModels/ShopViewModel";
import { ChangePasswordDto } from "../types/auth/ChangePasswordDto";
import { AuthWarehouseDto } from "../types/auth/AuthWarehouseDto";
import { Warehouse } from "../models/WareHouseModel";

@Injectable()
export class AuthApp {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<Warehouse>,
    private hashService: HashService,
    private jwtService: JWTService
  ) { }

  public createUser = async (dto: CreateUserDto) => {
    const userWithSameEmail = await this.userModel.findOne({ email: dto.email })

    if (userWithSameEmail) {
      throw new BadRequestException('Ja existe um usuario com esse email')
    }

    const empresaId = this.hashService.createIdToUser(dto.nome)

    const user = await this.userModel.create({
      nome: dto.nome,
      empresaId,
      email: dto.email,
      telefone: dto.telefone,
      senha: this.hashService.createHashWithSalt(dto.senha)
    })

    const depositoId = this.hashService.createIdToWarehouse(1)

    await this.warehouseModel.create({
      depositoId,
      empresaId,
      nome: "Depostio 1",
      endereco: {
        endereco: "0",
        bairro: "0",
        cidade: "0",
        estado: "0",
        cep: "0",
        numero: 0
      }
    })

    return user
  }

  public adminLogin = async (dto: AuthAdminDto) => {
    const user = await this.userModel.findOne({ email: dto.email })
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado')
    }

    const matchPassword = this.hashService.compareWithSalt(dto.senha, user.senha);
    if (!matchPassword) {
      throw new UnauthorizedException('Senha errada')
    }

    const userData: UserViewModel = mapToUserViewModel(user)
    const token = await this.jwtService.generateToken(userData)

    return {
      token
    }
  }

  public shopLogin = async (dto: AuthShopDto) => {
    const user = await this.userModel.findOne({ empresaId: dto.empresaId })
    if (!user) {
      throw new NotFoundException('O ID da empresa esta errado')
    }

    const shop = await this.shopModel.findOne({ empresaId: dto.empresaId, lojaId: dto.lojaId })
    if (!shop) {
      throw new NotFoundException('ID da loja não encontrado para essa empresa')
    }

    const shopData = mapToShopViewModel(shop)
    const token = await this.jwtService.generateToken(shopData)

    return {
      token
    }

  }

  public warehouseLogin = async (dto: AuthWarehouseDto) => {
    const user = await this.userModel.findOne({ empresaId: dto.empresaId })
    if (!user) {
      throw new NotFoundException('O ID da empresa esta errado')
    }

    const warehouse = await this.warehouseModel.findOne({ empresaId: dto.empresaId, depositoId: dto.depositoId })
    if (!warehouse) {
      throw new NotFoundException('ID da loja não encontrado para essa empresa')
    }

    const warehouseData = warehouse.toJSON()
    const token = await this.jwtService.generateToken(warehouseData)

    return {
      token
    }
  }

  public changePassword = async (dto: ChangePasswordDto) => {
    const newPassword = this.hashService.createHashWithSalt(dto.senha)
    const user = await this.userModel.findOneAndUpdate(
      { empresaId: dto.empresaId },
      { senha: newPassword },
      { new: true }
    )

    return user
  }

}
