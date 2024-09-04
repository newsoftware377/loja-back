import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/UserModel';
import { Model } from 'mongoose';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { UpdateUserDto } from '../types/auth/UpdateUserDto';
import { JWTService } from '../services/JWTService';

@Injectable()
export class UserApp {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JWTService
  ) { }

  public listUsers = async () => {
    const users = await this.userModel.find();

    return users;
  };

  public updateUser = async (user: UserViewModel, dto: UpdateUserDto) => {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { empresaId: user.empresaId },
      dto,
      { new: true }
    );

    const parsedUser = updatedUser.toObject()
    const token = await this.jwtService.generateToken(parsedUser)

    return {
      ...parsedUser,
      token
    };
  };
}
