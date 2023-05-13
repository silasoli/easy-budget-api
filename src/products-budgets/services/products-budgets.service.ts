import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  ProductsBudget,
  ProductsBudgetDocument,
} from '../schemas/products-budget.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryWithHelpers } from 'mongoose';
import { CreateProductsBudgetDto } from '../dto/create-products-budget.dto';
import { BudgetService } from '../../budget/services/budget.service';
import { ProductsService } from '../../products/services/products.service';
import { BudgetFilterDto } from '../dto/budget-filter.dto';
import { UpdateProductsBudgetDto } from '../dto/update-products-budget.dto';
import { Budget } from '../../budget/schemas/budget.entity';

@Injectable()
export class ProductsBudgetsService {
  constructor(
    @InjectModel(ProductsBudget.name)
    private productsBudgetModel: Model<ProductsBudgetDocument>,
    @Inject(forwardRef(() => BudgetService))
    private budgetService: BudgetService,
    private productService: ProductsService,
  ) {}

  private async findProductInBudget(
    budgetId: string,
    productId: string,
  ): Promise<void> {
    const item = await this.productsBudgetModel.findOne({
      budgetId,
      productId,
    });
    if (item) throw new BadRequestException('Item já adicionado!');
  }

  private async validProductCategory(
    budget: Budget,
    dto: CreateProductsBudgetDto,
  ): Promise<void> {
    const product = await this.productService.findOne(dto.productId);
    const verify = product.category.key === budget.category.key;
    const message = 'Categoria do Produto diferente da categoria do orçamento';
    if (!verify) throw new BadRequestException(message);
  }

  private async validCreate(dto: CreateProductsBudgetDto): Promise<void> {
    const budget = await this.budgetService.findOne(dto.budgetId);

    await this.validProductCategory(budget, dto);

    await this.findProductInBudget(dto.budgetId, dto.productId);
  }

  public async create(dto: CreateProductsBudgetDto): Promise<ProductsBudget> {
    await this.validCreate(dto);

    return this.productsBudgetModel.create(dto);
  }

  public async findAllProductsByBudget(_id: string): Promise<ProductsBudget[]> {
    await this.budgetService.findOne(_id);

    return this.productsBudgetModel.find({ budgetId: _id });
  }

  private async findProductsBudgetByID(_id: string): Promise<ProductsBudget> {
    const item = await this.productsBudgetModel.findById(_id);

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  public async findOne(_id: string): Promise<ProductsBudget> {
    return this.findProductsBudgetByID(_id);
  }

  public async update(
    _id: string,
    dto: UpdateProductsBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findOne(_id);

    return this.productsBudgetModel.updateOne({ _id }, dto);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.productsBudgetModel.deleteOne({ _id });
  }

  public async removeAllProductsBudgetByBudget(
    budgetId: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.productsBudgetModel.deleteMany({ budgetId });
  }
}
