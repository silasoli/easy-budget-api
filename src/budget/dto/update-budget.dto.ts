import { OmitType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';

export class UpdateBudgetDto extends OmitType(CreateBudgetDto, [
  'category',
] as const) {}
