import { OmitType } from '@nestjs/swagger';
import { CreateProductsBudgetDto } from './create-products-budget.dto';

export class UpdateProductsBudgetDto extends OmitType(CreateProductsBudgetDto, [
  'budgetId',
  'productId',
] as const) {}
