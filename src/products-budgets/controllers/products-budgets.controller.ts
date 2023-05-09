import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsBudgetsService } from './products-budgets.service';
import { CreateProductsBudgetDto } from './dto/create-products-budget.dto';
import { UpdateProductsBudgetDto } from './dto/update-products-budget.dto';

@Controller('products-budgets')
export class ProductsBudgetsController {
  constructor(private readonly productsBudgetsService: ProductsBudgetsService) {}

  @Post()
  create(@Body() createProductsBudgetDto: CreateProductsBudgetDto) {
    return this.productsBudgetsService.create(createProductsBudgetDto);
  }

  @Get()
  findAll() {
    return this.productsBudgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsBudgetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsBudgetDto: UpdateProductsBudgetDto) {
    return this.productsBudgetsService.update(+id, updateProductsBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsBudgetsService.remove(+id);
  }
}
