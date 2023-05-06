import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.entity';
import { Model, QueryWithHelpers } from 'mongoose';
import { MaterialCategoriesEnum } from '../enum/material-categories.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  public async findByName(name: string): Promise<Product> {
    return this.productModel.findOne({ email: name.toLowerCase() });
  }

  public validAccountType(accountType: string) {
    const types = Object.keys(MaterialCategoriesEnum);
    if (!types.includes(accountType)) throw Error('Categoria inválida');
  }

  private async validCreate(dto: CreateProductDto): Promise<void> {
    this.validAccountType(dto.category);

    const user = await this.findByName(dto.name);
    if (user) throw new BadRequestException('Name already used');
  }

  public async create(dto: CreateProductDto): Promise<Product> {
    const rawData = { ...dto };

    await this.validCreate(rawData);

    return this.productModel.create(rawData);
  }

  public async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  private async findProductByID(_id: string): Promise<Product> {
    const product = await this.productModel.findById(_id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  public async findOne(_id: string): Promise<Product> {
    return this.findProductByID(_id);
  }

  private async validUpdate(_id: string, dto: UpdateProductDto): Promise<void> {
    this.validAccountType(dto.category);

    if (dto.name) {
      const user = await this.findByName(dto.name);
      if (user && String(user._id) != _id)
        throw new BadRequestException('Name already used');
    }
  }

  public async update(
    _id: string,
    dto: UpdateProductDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findProductByID(_id);

    await this.validUpdate(_id, dto);

    const rawData = { ...dto };

    return this.productModel.updateOne({ _id }, rawData);
  }

  // public async remove(_id: string): Promise<any> {
  //   await this.findProductByID(_id);

  //   return this.productModel.deleteOne({ _id });
  // }
}
