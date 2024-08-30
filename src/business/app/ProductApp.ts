import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../types/product/CreateProductDt';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../models/ProductModel';
import { Model } from 'mongoose';
import * as bwipjs from 'bwip-js';
import { ProductWithCategory } from '../types/product/Product';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { UpdateProductDto } from '../types/product/UpdateProductDto';
import { Category, CategoryDocument } from '../models/CategoryModel';
import { CreateCategoryDto } from '../types/product/CreateCategoryDto';
import { mapToProductViewModel } from 'src/api/viewModels/ProductViewModel';
import { ListProductsDto } from '../types/product/ListProductsDto';

@Injectable()
export class ProductApp {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) { }

  public createProduct = async (
    dto: CreateProductDto,
    shop: ShopViewModel,
  ): Promise<ProductWithCategory> => {
    const product = await this.productModel.create({
      nome: dto.nome,
      categoriaId: dto.categoriaId,
      valorAtual: dto.valorAtual || dto.valorOriginal,
      valorOriginal: dto.valorOriginal,
      valorCompra: dto.valorCompra,
      lojaId: shop.lojaId,
      empresaId: shop.empresaId,
      codigoBarra: dto.codigoBarra,
      qtdMinima: dto.qtdMinima,
    });

    const category = await this.categoryModel.findOne({
      lojaId: shop.lojaId,
      _id: dto.categoriaId,
    });

    if (!category) {
      throw new NotFoundException('Categoria nao encontrada');
    }

    return {
      ...product.toJSON(),
      categoria: category.nome,
    };
  };

  public listProducts = async (
    shop: ShopViewModel | UserViewModel,
    lojaId: string,
    params: ListProductsDto,
  ) => {
    const filters = {};

    if (params.termo) {
      const termFilter: any[] = [
        { nome: { $regex: `.*${params.termo}.*`, $options: 'i'  }}
      ];

      if (!isNaN(Number(params.termo))) {
        termFilter.unshift(
          { codigoBarra: params.termo },
        )
      }

      filters['$or'] = termFilter
    }

    const products = await this.productModel
      .find({
        lojaId,
        empresaId: shop.empresaId,
        ...filters
      })
      .then((product) => product.map((x) => x.toJSON()));

    const categories = await this.categoryModel.find({ lojaId });

    const productWithCategory = await this.mapWithCategory(
      products,
      categories,
    );
    return productWithCategory;
  };

  public listProductsByBusiness = async (user: UserViewModel): Promise<any> => {
    const categories = await this.categoryModel.find({
      empresaId: user.empresaId,
    });
    const products = await this.productModel.aggregate([
      { $match: { empresaId: user.empresaId } },
      {
        $group: {
          _id: '$lojaId',
          products: { $push: '$$ROOT' },
        },
      },
    ]);

    const promises = products.map(async (item) => {
      const productsWithCategory = await this.mapWithCategory(
        item.products,
        categories,
      );
      return {
        lojaId: item._id,
        products: productsWithCategory.map(mapToProductViewModel),
      };
    });

    return Promise.all(promises);
  };

  private mapWithCategory = async (
    products: Product[],
    categories: CategoryDocument[],
  ) => {
    const categoriesHashMap = {};
    const productWithCategory = products.map((product) => {
      let category = '';
      if (categoriesHashMap[product.categoriaId]) {
        category = categoriesHashMap[product.categoriaId];
      } else {
        const categoryMatch = categories.find(
          (x) => x._id.toString() === product.categoriaId,
        );
        categoriesHashMap[product.categoriaId] = categoryMatch?.nome;
        category = categoryMatch?.nome;
      }

      return {
        ...product,
        categoria: category,
      };
    });

    return productWithCategory;
  };

  public deleteProduct = async (user: ShopViewModel, id: string) => {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      empresaId: user.empresaId,
      lojaId: user.lojaId,
    });

    return product;
  };

  public updateProduct = async (
    user: ShopViewModel,
    dto: UpdateProductDto,
    id: string,
  ) => {
    const query = {
      lojaId: user.lojaId,
      empresaId: user.empresaId,
      _id: id,
    };
    const product = await this.productModel.findOne(query);

    const productUpdated = await this.productModel.findOneAndUpdate(
      query,
      {
        ...product.toObject(),
        ...dto,
      },
      { new: true },
    );

    return productUpdated;
  };

  public async createCategory(user: ShopViewModel, dto: CreateCategoryDto) {
    const category = await this.categoryModel.create({
      nome: dto.nome,
      lojaId: user.lojaId,
    });

    return category.toJSON();
  }

  public async listCategories(lojaId: string) {
    const categories = await this.categoryModel.find({ lojaId });

    return categories;
  }

  public async updateCategoryName(
    dto: CreateCategoryDto,
    categoryId: string,
    user: ShopViewModel,
  ) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: categoryId, lojaId: user.lojaId },
      { nome: dto.nome },
      { new: true },
    );

    return category;
  }

  public async deleteCategory(categoryId: string, user: ShopViewModel) {
    const products = await this.productModel.find({
      lojaId: user.lojaId,
      categoriaId: categoryId,
    });

    if (products.length) {
      throw new BadRequestException(
        'Essa categoria nao pode ser excluida pois tem produtos nela',
      );
    }

    const category = await this.categoryModel.findOneAndDelete({
      lojaId: user.lojaId,
      _id: categoryId,
    });

    return category;
  }
}
