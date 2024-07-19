import { CategoryDocument } from "src/business/models/CategoryModel";

export interface CategoryViewModel {
  nome: string;
  lojaId: string;
  id: string
}

export const mapToCategoryViewModel = (category: CategoryDocument): CategoryViewModel => ({
  lojaId: category.lojaId,
  nome: category.nome,
  id: category._id.toString()
})
