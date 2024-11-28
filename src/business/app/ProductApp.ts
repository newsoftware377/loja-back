import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../types/product/CreateProductDt';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../models/ProductModel';
import { Model } from 'mongoose';
import { ProductWithCategoryAndValue } from '../types/product/Product';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { UpdateProductDto } from '../types/product/UpdateProductDto';
import { Category, CategoryDocument } from '../models/CategoryModel';
import { CreateCategoryDto } from '../types/product/CreateCategoryDto';
import { mapToProductViewModel, ProductViewModel } from 'src/api/viewModels/ProductViewModel';
import { ListProductsDto } from '../types/product/ListProductsDto';
import { StockApp } from './StockApp';
import { Stock } from '../models/StockModel';
import { ProductShop } from '../models/ProductShopModel';
import { AllProductInPromotion } from '../types/product/AllProductsInPromotionDto';
import Decimal from 'decimal.js';
import { Warehouse } from '../models/WareHouseModel';

@Injectable()
export class ProductApp {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductShop.name)
    private readonly productShopModel: Model<ProductShop>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Warehouse.name)
    private readonly stockApp: StockApp,
  ) { }

  public createProduct = async (
    dto: CreateProductDto,
    user: ShopViewModel | Warehouse,
  ): Promise<ProductWithCategoryAndValue> => {
    const lojaId = 'lojaId' in user ? user.lojaId : dto.lojaId;
    const depositoId = 'depositoId' in user ? user.depositoId : '';

    const product = await this.productModel.create({
      nome: dto.nome,
      categoriaId: dto.categoriaId,
      valorOriginal: dto.valorOriginal,
      valorCompra: dto.valorCompra,
      lojaId: lojaId,
      empresaId: user.empresaId,
      codigoBarra: dto.codigoBarra,
      qtdMinima: dto.qtdMinima,
      depositoId: depositoId,
    });

    const category = await this.categoryModel.findOne({
      lojaId: lojaId,
      _id: dto.categoriaId,
    });

    if (!category) {
      throw new NotFoundException('Categoria nao encontrada');
    }

    const productShop = await this.productShopModel.create({
      lojaId: dto.lojaId,
      produtoId: product._id.toString(),
      depositoId: depositoId,
      valorAtual: dto.valorAtual,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    });

    return {
      ...product.toJSON(),
      ...productShop.toJSON(),
      categoria: category.nome,
    };
  };

  public listProductsToShop = async (
    lojaId: string,
    params: ListProductsDto,
  ) => {
    const filters = {};

    if (params.termo) {
      const termFilter: any[] = [
        { nome: { $regex: `.*${params.termo}.*`, $options: 'i' } },
      ];

      if (!isNaN(Number(params.termo))) {
        termFilter.unshift({ codigoBarra: params.termo });
      }

      filters['$or'] = termFilter;
    }

    const products = await this.aggregateProducts({
      lojaId,
      ...filters,
    });

    const stock = await this.stockApp.getStockByShopId(lojaId);

    const categories = await this.categoryModel.find({ lojaId });

    const productWithCategory = await this.mapWithCategoryAndQty(
      products,
      categories,
      stock,
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

  private mapWithCategoryAndQty = async (
    products: ProductDocument[],
    categories: CategoryDocument[],
    stock: Stock[],
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

      const stockProduct = stock.find(
        (x) => x.produtoId === product._id.toString(),
      );

      return {
        ...product,
        categoria: category,
        qtd: stockProduct?.qtd || 0,
      };
    });

    return productWithCategory;
  };

  public deleteProduct = async (user: Warehouse, id: string) => {
    const product = await this.productModel.findOneAndDelete({
      _id: id,
      empresaId: user.empresaId,
    });

    await this.productShopModel.deleteMany({
      _id: id
    })

    return product;
  };

  public updateProduct = async (
    user: ShopViewModel | Warehouse,
    dto: UpdateProductDto,
    id: string,
  ) => {
    const query = {
      lojaId: dto.lojaId,
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

    const productShopUpdated = await this.productShopModel.findOneAndUpdate(
      { _id: product._id},
      { valorAtual: dto.valorAtual }
    )
    

    return {
      ...productUpdated,
      ...productShopUpdated
    };
  };

  public async createCategory(
    user: ShopViewModel | Warehouse,
    dto: CreateCategoryDto,
  ) {
    const category = await this.categoryModel.create({
      nome: dto.nome,
      empresaId: user.empresaId,
    });

    return category.toJSON();
  }

  public async listCategories(empresaId: string) {
    const categories = await this.categoryModel.find({ empresaId });

    return categories;
  }

  public async updateCategoryName(
    dto: CreateCategoryDto,
    categoryId: string,
    user: ShopViewModel | Warehouse,
  ) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: categoryId, empresaId: user.empresaId },
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

  public async undoPromotion(id: string, user: ShopViewModel) {
    const product = await this.productModel.findOne({
      lojaId: user.lojaId,
      _id: id,
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }
    const newProduct = await this.productModel.findOneAndUpdate(
      { lojaId: user.lojaId, _id: id },
      { valorAtual: product.valorOriginal },
      { new: true },
    );

    return newProduct;
  }

  public async undoAllPromotions(user: ShopViewModel) {
    const products = await this.productModel.find({
      lojaId: user.lojaId,
    });

    if (!products) {
      throw new BadRequestException('Produto não encontrado');
    }

    const updatedProducts = products.map((x) => ({
      updateOne: {
        filter: { _id: x._id },
        update: { valorAtual: x.valorOriginal },
      },
    }));

    await this.productModel.bulkWrite(updatedProducts);

    return {
      ok: true,
    };
  }

  public async allProductsInPromotion(
    user: ShopViewModel,
    dto: AllProductInPromotion,
  ) {
    const products = await this.productModel.find({ lojaId: user.lojaId });

    const calcValue = (value: number) => {
      const percentage = new Decimal(100).minus(dto.porcentagemDesconto);

      const newValue = new Decimal(value)
        .times(percentage)
        .dividedBy(100)
        .toFixed(2);
      return Number(newValue);
    };

    const updatedProducts = products.map((x) => ({
      updateOne: {
        filter: { _id: x._id },
        update: { valorAtual: calcValue(x.valorOriginal) },
      },
    }));

    await this.productModel.bulkWrite(updatedProducts);

    return {
      ok: true,
    };
  }

  private aggregateProducts = async (filters: Object) => {
    const x =  await this.productShopModel.aggregate([
      {
        $match: filters
      },
      {
        $addFields: {
          produto_id: {
            $toObjectId: '$produtoId',
          },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'produto_id',
          foreignField: '_id',
          as: 'produto',
        },
      },
      {
        $project: {
          nome: { $first: '$produto.nome' },
          categoriaId: { $first: '$produto.categoriaId' },
          valorOriginal: { $first: '$produto.valorOriginal' },
          valorCompra: { $first: '$produto.valorCompra' },
          codigoBarra: { $first: '$produto.codigoBarra' },
          qtdMinima: { $first: '$produto.qtdMinima' },
          empresaId: { $first: '$produto.empresaId' },
          produtoId: { $first: '$produto._id' },
          valorAtual: 1,
          lojaId: 1,
        },
      },
    ])  

    return x as ProductDocument[]
  };
}
