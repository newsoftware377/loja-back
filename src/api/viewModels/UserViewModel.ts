import { UserDocumnet } from "src/business/models/UserModel";
import { Roles } from "src/utils/enums/Roles";

export interface UserViewModel {
  nome: string;
  email: string;
  telefone: number
  id: string
  empresaId: string
  cargo: Roles
}

export const mapToUserViewModel = (user: UserDocumnet): UserViewModel => ({
  email: user.email,
  telefone: user.telefone,
  nome: user.nome,
  id: user._id.toString(),
  empresaId: user.empresaId,
  cargo: user.cargo
})
