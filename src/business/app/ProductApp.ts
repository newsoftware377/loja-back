import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../types/product/CreateProductDt';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../models/ProductModel';
import { Model } from 'mongoose';
import * as bwipjs from 'bwip-js';
import { ProductWithBarCode } from '../types/product/Product';
import { ShopViewModel } from 'src/api/viewModels/ShopViewModel';
import { UserViewModel } from 'src/api/viewModels/UserViewModel';
import { UpdateProductDto } from '../types/product/UpdateProductDto';

@Injectable()
export class ProductApp {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) { }

  public createProduct = async (
    dto: CreateProductDto,
    shop: ShopViewModel
  ): Promise<ProductWithBarCode> => {

    const product = await this.productModel.create({
      nome: dto.nome,
      categoria: dto.categoria,
      valorAtual: dto.valorAtual || dto.valorOriginal,
      valorOriginal: dto.valorOriginal,
      valorCompra: dto.valorCompra,
      lojaId: shop.lojaId,
      empresaId: shop.empresaId,
      codigoBarra: dto.codigoBarra
    });

    let code = '';
    try {
      code = (await this.generateBarCodeImg(String(dto.codigoBarra))) as string;
    } catch(err) {
    }

    return {
      ...product.toJSON(),
      codigoBarraImg: code,
    };
  };

  public listProducts = async (shop: ShopViewModel | UserViewModel, lojaId: string) => {
   const products = await this.productModel.find({ lojaId, empresaId: shop.empresaId})
   const promises = products.map(async (product) => ({
      ...product.toJSON(),
      codigoBarraImg: await this.generateBarCodeImg(String(product.codigoBarra)) as string 
   }))

   const productWithBarCode = await Promise.all(promises) 

   return productWithBarCode
  }

  public deleteProduct = async (user: ShopViewModel, id: string) => {
    const product = await this.productModel.findOneAndDelete(
      {
        _id: id,
        empresaId: user.empresaId,
        lojaId: user.lojaId,
      }
    );

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
    }
    const product = await this.productModel.findOne(query);

    const productUpdated = await this.productModel.findOneAndUpdate(query, {
      ...product.toObject(),
      ...dto
    }, { new: true })

    return productUpdated
  };

  private generateBarCodeImg(code: string) {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'upca',
          text: code,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
          backgroundcolor: ''
        },
        function(error, buffer) {
          if (error) {
            reject(error);
          } else {
            let imageBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
            resolve(imageBase64);
          }
        },
      );
    });
  }
}
