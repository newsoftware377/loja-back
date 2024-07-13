import { Injectable } from '@nestjs/common';
import { CreateClientDto } from '../types/client/CreateClientDto';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from '../models/ClientModel';
import { Model } from 'mongoose';
import { UpdateClientDto } from '../types/client/UpdateClientDto';

@Injectable()
export class ClientApp {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<Client>,
  ) { }

  public createClient = async (dto: CreateClientDto, user: ShopViewModel) => {
    const client = await this.clientModel.create({
      nome: dto.nome,
      telefone: dto.telefone,
      cpf: dto.cpf,
      empresaId: user.empresaId,
      lojaId: user.lojaId,
      endereco: dto.endereco,
    });

    return client;
  };

  public listClients = async (user: ShopViewModel) => {
    const clients = await this.clientModel.find({
      empresaId: user.empresaId,
      lojaId: user.lojaId,
    });

    return clients ?? [];
  };

  public deleteClient = async (user: ShopViewModel, id: string) => {
    const client = await this.clientModel.findOneAndDelete(
      {
        _id: id,
        empresaId: user.empresaId,
        lojaId: user.lojaId,
      }
    );

    return client;
  };

  public updateClient = async (
    user: ShopViewModel,
    dto: UpdateClientDto,
    id: string,
  ) => {
    const query = {
      lojaId: user.lojaId,
      empresaId: user.empresaId,
      _id: id,
    }
    const client = await this.clientModel.findOne(query);

    const clientUpdated = await this.clientModel.findOneAndUpdate(query, {
      ...client.toObject(),
      ...dto
    }, { new: true })

    return clientUpdated
  };
}
