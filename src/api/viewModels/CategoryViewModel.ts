import { CategoryDocument } from "src/business/models/CategoryModel";

export interface CategoryViewModel {
  nome: string;
  empresaId: string;
  id: string
}

export const mapToCategoryViewModel = (category: CategoryDocument): CategoryViewModel => ({
  empresaId: category.empresaId,
  nome: category.nome,
  id: category._id.toString()
})
