import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Budget, BudgetDocument } from '../schemas/budget.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name)
    private budgetModel: Model<BudgetDocument>,
  ) {}

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

    return this.budgetModel.create(dto);
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
    return this.findBudgetByID(_id);
  }

  private async validUpdate(_id: string, dto: UpdateBudgetDto): Promise<void> {
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
    return this.budgetModel.deleteOne({ _id });
  }
}
