import { ApiProperty } from '@nestjs/swagger';
import { CategoryFilterDto } from './category-filter.dto';
import { IsOptional } from 'class-validator';

export class NameFilterDto extends CategoryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;
}
