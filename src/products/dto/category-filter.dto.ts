import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MaterialCategoriesEnum } from '../enum/material-categories.enum';

export class CategoryFilterDto {
  @ApiProperty({ required: true, enum: MaterialCategoriesEnum })
  @IsNotEmpty({ message: 'É necessário informar a categoria.' })
  category: MaterialCategoriesEnum;
}
