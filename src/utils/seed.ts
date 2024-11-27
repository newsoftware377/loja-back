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

}
