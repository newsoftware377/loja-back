import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JWTService } from '../services/JWTService';
import { StockViewModel } from 'src/api/viewModels/StockViewModel';

type Clients = {
  [key: string]: string[];
};

@WebSocketGateway({ transports: ['websocket'] })
export class StockGatway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Clients = {};

  @WebSocketServer()
  private server: Server;

  constructor(private readonly jwtService: JWTService) { }

  async handleConnection(client: Socket) {
    const lojaId = client.handshake.query.id as string;

    try {
      await this.validateUser(client);
      const clientsWithSameLojaId = this.clients[lojaId] || [];
      this.clients[lojaId] = [...clientsWithSameLojaId, client.id];
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const lojaId = client.handshake.query.id as string;
    const clientsWithSameLojaId = this.clients[lojaId] || [];

    this.clients[lojaId] = clientsWithSameLojaId.filter((x) => x !== client.id);
  }

  async notifyStockChanges(dto: StockViewModel[]) {
    const lojaId = dto[0].lojaId;
    const clients = this.clients[lojaId];

    this.server.to(clients).emit('estoque/mudanca', dto);
  }

  private async validateUser(client: Socket) {
    const token = client.handshake.auth.token;

    await this.jwtService.decodeToken(token);
  }
}
