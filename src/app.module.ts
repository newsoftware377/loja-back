import { Logger, Module } from '@nestjs/common';
import { AuthController } from './api/controllers/AuthController';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './business/models/UserModel';
import { AuthApp } from './business/app/AuthApp';
import { HashService } from './business/services/HashService';
import { Shop, ShopSchema } from './business/models/ShopModel';
import { JWTService } from './business/services/JWTService';
import { Product, ProductSchema } from './business/models/ProductModel';
import { ProductController } from './api/controllers/ProductController';
import { ProductApp } from './business/app/ProductApp';
import { ShopController } from './api/controllers/ShopController';
import { ShopApp } from './business/app/ShopApp';
import { Client, ClientSchema } from './business/models/ClientModel';
import { ClientController } from './api/controllers/ClientController';
import { ClientApp } from './business/app/ClientApp';
import { StockController } from './api/controllers/StockController';
import { StockApp } from './business/app/StockApp';
import { Stock, StockSchema } from './business/models/StockModel';
import { StockGatway } from './business/gatways/StockGateway';
import { Order, OrderSchema } from './business/models/OrderModel';
import { OrderController } from './api/controllers/OrderController';
import { OrderApp } from './business/app/OrderApp';
import { Category, CategorySchema } from './business/models/CategoryModel';
import { ReportController } from './api/controllers/ReportController';
import { ReportApp } from './business/app/ReportApp';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportSchema, Report } from './business/models/ReportModel';
import { ReportService } from './business/services/ReportService';
import { UserController } from './api/controllers/UserController';
import { UserApp } from './business/app/UserApp';
import { Box, BoxSchema } from './business/models/BoxModel';
import { BoxController } from './api/controllers/BoxModel';
import { BoxApp } from './business/app/BoxApp';

@Module({
  imports: [
   MongooseModule.forRoot(process.env.MONGODB_URL),
   MongooseModule.forFeature([
     { name: User.name, schema: UserSchema },
     { name: Shop.name, schema: ShopSchema },
     { name: Product.name, schema: ProductSchema },
     { name: Category.name, schema: CategorySchema},
     { name: Client.name, schema: ClientSchema },
     { name: Stock.name, schema: StockSchema },
     { name: Order.name, schema: OrderSchema },
     { name: Report.name, schema: ReportSchema },
     { name: Box.name, schema: BoxSchema }
   ]),
   ScheduleModule.forRoot()
  ],
  controllers: [
    AuthController,
    ProductController,
    ClientController,
    StockController,
    ShopController,
    OrderController,
    ReportController,
    UserController,
    BoxController
  ],
  providers: [
    AuthApp,
    ProductApp,
    ShopApp,
    ClientApp,
    StockApp,
    OrderApp,
    UserApp,
    ReportApp,
    BoxApp,
    HashService,
    JWTService,
    StockGatway,
    Logger,
    ReportService
  ],
})

export class AppModule {}
