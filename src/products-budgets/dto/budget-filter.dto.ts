import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BudgetFilterDto {
  @ApiProperty({ required: true, example: '{BUDGET_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o ID do Orçamento.' })
  budgetId: string;
}
