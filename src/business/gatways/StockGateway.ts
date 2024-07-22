import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JWTService } from '../services/JWTService';
import { mapToStockViewModel, StockViewModel } from 'src/api/viewModels/StockViewModel';
import { StockApp } from '../app/StockApp';
import { InjectModel } from '@nestjs/mongoose';
import { Stock } from '../models/StockModel';
import { Model } from 'mongoose';

type Clients = {
  [key: string]: string[];
};

@WebSocketGateway({ transports: ['websocket'] })
export class StockGatway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly STOCK_CHANGE_EVENT = 'estoque/mudanca'
  
  private clients: Clients = {};
  @WebSocketServer()
  private server: Server;

  constructor(
   private readonly jwtService: JWTService,
   @InjectModel(Stock.name) private readonly stockModel: Model<Stock>
  ) { }

  async handleConnection(client: Socket) {
    const lojaIds = (client.handshake.query.lojaIds as string).split(',');

    try {
      await this.validateUser(client);
      lojaIds.forEach(id => {
        const clientsWithSameLojaId = this.clients[id] || [];
        this.clients[id] = [...clientsWithSameLojaId, client.id];
      })
      const stock = await this.listStockByShopId(lojaIds)
      this.server.to(client.id).emit(this.STOCK_CHANGE_EVENT, stock)
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const lojaIds = (client.handshake.query.lojaIds as string).split(',')

    lojaIds.forEach(id => {
      const clientsWithSameLojaId = this.clients[id] || [];
      this.clients[id] = clientsWithSameLojaId.filter((x) => x !== client.id);
    })
  }

  async notifyStockChanges(dto: StockViewModel[]) {
    const lojaId = dto[0].lojaId;
    const clients = this.clients[lojaId];
    console.log(clients, lojaId, dto)

    this.server.to(clients).emit(this.STOCK_CHANGE_EVENT, dto);
  }

  private async validateUser(client: Socket) {
    const token = client.handshake.auth.token;

    await this.jwtService.decodeToken(token);
  }

  private async listStockByShopId(shopIds: string[]){
    const stock = await this.stockModel.find({ lojaId: { $in: shopIds }})

    return stock.map(mapToStockViewModel)
  }
}
