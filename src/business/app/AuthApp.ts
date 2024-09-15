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

@Injectable()
export class AuthApp {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Shop.name) private readonly shopModel: Model<Shop>,
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
