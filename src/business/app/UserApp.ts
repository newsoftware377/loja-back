import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../models/UserModel";
import { Model } from "mongoose";

@Injectable()
export class UserApp {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  public listUsers = async () => {
    const users = await this.userModel.find();

    return users
  }
}
