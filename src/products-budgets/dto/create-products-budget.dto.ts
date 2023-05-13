import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class CreateProductsBudgetDto {
  @ApiProperty({ required: true, example: '{BUDGET_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o ID do Orçamento.' })
  @IsMongoId({ message: 'Invalid Format of ID' })
  budgetId: string;

  @ApiProperty({ required: true, example: '{PRODUCT_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o ID do Produto.' })
  @IsMongoId({ message: 'Invalid Format of ID' })
  productId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar a quantidade.' })
  @IsInt({ message: 'A quantidade deve ser um inteiro' })
  @Min(1, { message: 'Deve ser adicionado pelo menos um item.' })
  quantity: number;
}
