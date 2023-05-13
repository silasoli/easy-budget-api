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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  public async findByName(name: string): Promise<Product> {
    return this.productModel.findOne({ name: name.toLowerCase() });
  }

  private getCategoryLabel(materialType: string): CategoryType {
    return MaterialCategoriesLabels[materialType];
  }

  private async validCreate(dto: CreateProductDto): Promise<void> {
    ValidationUtil.validCategoryType(dto.category);

    const product = await this.findByName(dto.name);
    if (product) throw new BadRequestException('Nome já utilizado.');
  }

  public async create(dto: CreateProductDto): Promise<Product> {
    await this.validCreate(dto);

    const materialLabel = this.getCategoryLabel(dto.category);

    return this.productModel.create({ ...dto, category: materialLabel });
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

  private async findProductByID(_id: string): Promise<Product> {
    const product = await this.productModel.findById(_id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  public async findOne(_id: string): Promise<Product> {
    return this.findProductByID(_id);
  }

  private async validUpdate(_id: string, dto: UpdateProductDto): Promise<void> {
    if (dto.name) {
      const product = await this.findByName(dto.name);
      if (product && String(product._id) != _id)
        throw new BadRequestException('Nome já utilizado.');
    }
  }

  public async update(
    _id: string,
    dto: UpdateProductDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findProductByID(_id);

    await this.validUpdate(_id, dto);

    const product = { ...dto };

    return this.productModel.updateOne({ _id }, product);
  }

  // public async remove(_id: string): Promise<any> {
  //   await this.findProductByID(_id);

  //   return this.productModel.deleteOne({ _id });
  // }
}
