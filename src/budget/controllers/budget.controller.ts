import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Budget } from '../schemas/budget.entity';
import { Aggregate, QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';
import { ProductsBudgetsService } from '../../products-budgets/services/products-budgets.service';
import { ICalcAmount } from '../../products-budgets/interfaces/ICalcAmount.interface';

@ApiBearerAuth()
@ApiTags('Budgets')
@Controller('budgets')
@UseGuards(AuthUserJwtGuard)
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly productsBudgetsService: ProductsBudgetsService,
  ) {}

  @Post()
  public async create(@Body() dto: CreateBudgetDto): Promise<Budget> {
    return this.budgetService.create(dto);
  }

  @Get()
  public async findAll(): Promise<Budget[]> {
    return this.budgetService.findAll();
  }

  @Get(':id/amounts')
  public async findAllAmounts(@Param('id') _id: string): Promise<ICalcAmount> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.calcAmountsByBudget(_id);
  }

  @Get(':id/html')
  public async generatePDF(@Param('id') _id: string): Promise<string> {
    ValidationUtil.validObjectId(_id);
    return this.productsBudgetsService.generatePdf(_id);
  }

  @Get(':id')
  public async findOne(@Param('id') _id: string): Promise<Budget> {
    ValidationUtil.validObjectId(_id);
    return this.budgetService.findOneWithPopulate(_id);
  }

  @Patch(':id')
  public async update(
    @Param('id') _id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.budgetService.update(_id, updateBudgetDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.budgetService.remove(_id);
  }
}
