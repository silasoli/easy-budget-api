import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from '../services/budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Budget } from '../schemas/budget.entity';
import { QueryWithHelpers } from 'mongoose';

@ApiBearerAuth()
@ApiTags('Budgets')
@Controller('budgets')
@UseGuards(AuthUserJwtGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  public async create(@Body() dto: CreateBudgetDto): Promise<Budget> {
    return this.budgetService.create(dto);
  }

  @Get()
  public async findAll(): Promise<Budget[]> {
    return this.budgetService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Budget> {
    return this.budgetService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.budgetService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.budgetService.remove(id);
  }
}
