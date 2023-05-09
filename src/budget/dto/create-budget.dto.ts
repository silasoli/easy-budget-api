import { ApiProperty } from '@nestjs/swagger';
import { MaterialCategoriesEnum } from '../../products/enum/material-categories.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do Orçamento.' })
  name: string;

  @ApiProperty({ required: true, example: '{SELLER_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o nome do Vendedor.' })
  sellerId: string;

  @ApiProperty({ required: true, example: '{CUSTOMER_ID}' })
  @IsNotEmpty({ message: 'É necessário informar o nome do Cliente.' })
  customerId: string;

  @ApiProperty({ required: true, enum: MaterialCategoriesEnum })
  @IsNotEmpty({ message: 'É necessário informar a categoria.' })
  category: MaterialCategoriesEnum;
}
