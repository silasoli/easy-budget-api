import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  CategoryType,
  Product,
  ProductDocument,
} from '../schemas/product.entity';
import { Model, QueryWithHelpers } from 'mongoose';
import { MaterialCategoriesLabels } from '../enum/material-categories.enum';
import { CategoryFilterDto } from '../dto/category-filter.dto';
import { ValidationUtil } from '../../common/validations.util';
import { NameFilterDto } from '../dto/name-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  public async findByNameAndCategory(
    name: string,
    categoryitem: string,
  ): Promise<Product> {
    const category = this.getCategoryLabel(categoryitem);
    return this.productModel.findOne({ name: name.toLowerCase(), category });
  }

  private getCategoryLabel(materialType: string): CategoryType {
    return MaterialCategoriesLabels[materialType];
  }

  private async validCreate(dto: CreateProductDto): Promise<void> {
    ValidationUtil.validCategoryType(dto.category);

    const product = await this.findByNameAndCategory(dto.name, dto.category);
    const category = ValidationUtil.validEqualsCategory(dto.category, product);
    if (product && category)
      throw new BadRequestException('Nome já utilizado.');
  }

  public async create(dto: CreateProductDto): Promise<Product> {
    await this.validCreate(dto);

    const materialLabel = this.getCategoryLabel(dto.category);

    return this.productModel.create({ ...dto, category: materialLabel });
  }

  public async findAllNames(filter: CategoryFilterDto): Promise<Product[]> {
    ValidationUtil.validCategoryType(filter.category);

    const category = this.getCategoryLabel(filter.category);

    return this.productModel.find({ category }, { name: 1 });
  }

  public async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  public async findAllByCategory(
    filter: CategoryFilterDto,
  ): Promise<Product[]> {
    ValidationUtil.validCategoryType(filter.category);

    const category = this.getCategoryLabel(filter.category);

    return this.productModel.find({ category });
  }

  public async filterByNameAndCategory(
    filter: NameFilterDto,
  ): Promise<Product[]> {
    ValidationUtil.validCategoryType(filter.category);

    const category = this.getCategoryLabel(filter.category);

    if (!filter.name) {
      return this.productModel.find({ category });
    }

    filter.name = filter.name.toLowerCase();
    const name = new RegExp(filter.name, 'i');

    return this.productModel.find({ category, name });
  }

  private async findProductByID(_id: string): Promise<Product> {
    const product = await this.productModel.findById(_id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  public async findOne(_id: string): Promise<Product> {
    return this.findProductByID(_id);
  }

  private async validUpdate(
    _id: string,
    dto: UpdateProductDto,
    product: Product,
  ): Promise<void> {
    if (dto.name) {
      const existproduct = await this.findByNameAndCategory(
        dto.name,
        product.category.key,
      );
      if (existproduct && String(existproduct._id) != _id)
        throw new BadRequestException('Nome já utilizado.');
    }
  }

  public async update(
    _id: string,
    dto: UpdateProductDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    const find = await this.findProductByID(_id);

    await this.validUpdate(_id, dto, find);

    const product = { ...dto };

    return this.productModel.updateOne({ _id }, product);
  }

  // public async remove(_id: string): Promise<any> {
  //   await this.findProductByID(_id);

  //   return this.productModel.deleteOne({ _id });
  // }
}
