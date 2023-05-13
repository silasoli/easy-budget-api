import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductsBudgetDto } from '../dto/create-products-budget.dto';
import { ProductsBudgetsService } from '../services/products-budgets.service';
import { UpdateProductsBudgetDto } from '../dto/update-products-budget.dto';
import { ProductsBudget } from '../schemas/products-budget.entity';
import { QueryWithHelpers } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { BudgetFilterDto } from '../dto/budget-filter.dto';
import { ValidationUtil } from '../../common/validations.util';

@ApiTags('Products Budgets')
@Controller('products-budgets')
export class ProductsBudgetsController {
  constructor(
    private readonly productsBudgetsService: ProductsBudgetsService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateProductsBudgetDto,
  ): Promise<ProductsBudget> {
    return this.productsBudgetsService.create(dto);
  }

  @Get(':id')
  public async findOne(@Param('id') _id: string): Promise<ProductsBudget> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.findOne(_id);
  }

  @Get('budgets/:id')
  public async findAll(@Param('id') _id: string): Promise<ProductsBudget[]> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.findAllProductsByBudget(_id);
  }

  @Patch(':id')
  public async update(
    @Param('id') _id: string,
    @Body() updateProductsBudgetDto: UpdateProductsBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.update(_id, updateProductsBudgetDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.remove(_id);
  }
}
