import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MaterialCategoriesEnum } from '../enum/material-categories.enum';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do Produto.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar a marca do Produto.' })
  brand: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o Preço do Produto.' })
  price: string;

  @ApiProperty({ required: true, enum: MaterialCategoriesEnum })
  @IsNotEmpty({ message: 'É necessário informar a categoria.' })
  category: MaterialCategoriesEnum;
}
