import { PartialType } from '@nestjs/swagger';
import { CreateProductsBudgetDto } from './create-products-budget.dto';

export class UpdateProductsBudgetDto extends PartialType(CreateProductsBudgetDto) {}
