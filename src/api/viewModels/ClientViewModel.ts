import { ClientDocument } from "src/business/models/ClientModel"
import { Address } from "src/business/types/shared/Address"

export interface ClientViewModel {
  nome: string
  telefone: number
  cpf: string
  endereco: Address
  id: string
}

export const mapToClientViewModel = (client: ClientDocument): ClientViewModel => ({
  cpf: client.cpf,
  nome: client.nome,
  telefone: client.telefone,
  endereco: client.endereco,
  id: client._id.toString()
})
