import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ProductsBudget,
  ProductsBudgetDocument,
} from '../schemas/products-budget.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';

@Injectable()
export class ProductsBudgetsService {
  ProductsBudgetModel: any;
  constructor(
    @InjectModel(ProductsBudget.name)
    private ProductsProductsBudgetModel: Model<ProductsBudgetDocument>,
  ) {}

  private async findByName(name: string): Promise<ProductsBudget> {
    return this.ProductsBudgetModel.findOne({ name: name.toLowerCase() });
  }

  private async validCreate(dto): Promise<void> {
    ValidationUtil.validCategoryType(dto.category);

    const name = await this.findByName(dto.name);
    if (name) throw new BadRequestException('Nome já utilizado.');
  }

  public async create(dto): Promise<ProductsBudget> {
    await this.validCreate(dto);

    return this.ProductsBudgetModel.create(dto);
  }

  public async findAll(): Promise<ProductsBudget[]> {
    return this.ProductsBudgetModel.find().populate([
      { path: 'customerId' },
      { path: 'sellerId' },
    ]);
  }

  private async findBudgetByID(_id: string): Promise<ProductsBudget> {
    const customer = await this.ProductsBudgetModel.findById(_id).populate([
      { path: 'customerId' },
      { path: 'sellerId' },
    ]);

    if (!customer) throw new NotFoundException('Budget not found');

    return customer;
  }

  public async findOne(_id: string): Promise<ProductsBudget> {
    return this.findBudgetByID(_id);
  }

  private async validUpdate(_id: string, dto): Promise<void> {
    if (dto.category) {
      ValidationUtil.validCategoryType(dto.category);
    }

    if (dto.name) {
      const customer = await this.findByName(dto.name);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('Nome já utilizado.');
    }
  }

  public async update(
    _id: string,
    dto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findBudgetByID(_id);

    await this.validUpdate(_id, dto);

    const rawData = { ...dto };

    return this.ProductsBudgetModel.updateOne({ _id }, rawData);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.ProductsBudgetModel.deleteOne({ _id });
  }
}
