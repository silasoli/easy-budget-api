import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CategoryFilterDto } from './category-filter.dto';

export class NameFilterDto extends CategoryFilterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar um texto.' })
  name: string;
}
