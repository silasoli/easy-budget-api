import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BudgetFilterDto {
  @ApiProperty({ required: true, example: '{BUDGET_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o ID do Orçamento.' })
  @IsMongoId({ message: 'Invalid Format of ID' })
  budgetId: string;
}
