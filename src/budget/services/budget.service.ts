import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Budget, BudgetDocument } from '../schemas/budget.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';
import { ProductsBudgetsService } from '../../products-budgets/services/products-budgets.service';
import { MaterialCategoriesLabels } from '../../products/enum/material-categories.enum';
import { CategoryType } from '../../products/schemas/product.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name)
    private budgetModel: Model<BudgetDocument>,
    @Inject(forwardRef(() => ProductsBudgetsService))
    private productsBudgetsService: ProductsBudgetsService,
  ) {}

  private getCategoryLabel(materialType: string): CategoryType {
    return MaterialCategoriesLabels[materialType];
  }

  private async findByName(name: string): Promise<Budget> {
    return this.budgetModel.findOne({ name: name.toLowerCase() });
  }

  private async validCreate(dto: CreateBudgetDto): Promise<void> {
    ValidationUtil.validCategoryType(dto.category);

    const name = await this.findByName(dto.name);
    if (name) throw new BadRequestException('Nome já utilizado.');
  }

  public async create(dto: CreateBudgetDto): Promise<Budget> {
    await this.validCreate(dto);

    const materialLabel = this.getCategoryLabel(dto.category);

    return this.budgetModel.create({ ...dto, category: materialLabel });
  }

  public async findAll(): Promise<Budget[]> {
    return this.budgetModel
      .find()
      .populate([{ path: 'customerId' }, { path: 'sellerId' }]);
  }

  private async findBudgetByID(_id: string): Promise<Budget> {
    const customer = await this.budgetModel
      .findById(_id)
      .populate([{ path: 'customerId' }, { path: 'sellerId' }]);

    if (!customer) throw new NotFoundException('Budget not found');

    return customer;
  }

  public async findOne(_id: string): Promise<Budget> {
    const budget = await this.budgetModel.findById(_id);

    if (!budget) throw new NotFoundException('Budget not found');

    return budget;
  }

  public async findOneWithPopulate(_id: string): Promise<Budget> {
    return this.findBudgetByID(_id);
  }

  private async validUpdate(_id: string, dto: UpdateBudgetDto): Promise<void> {
    if (dto.name) {
      const customer = await this.findByName(dto.name);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('Nome já utilizado.');
    }
  }

  public async update(
    _id: string,
    dto: UpdateBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findBudgetByID(_id);

    await this.validUpdate(_id, dto);

    const rawData = { ...dto };

    return this.budgetModel.updateOne({ _id }, rawData);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.productsBudgetsService.removeAllProductsBudgetByBudget(_id);
    return this.budgetModel.deleteOne({ _id });
  }
}
