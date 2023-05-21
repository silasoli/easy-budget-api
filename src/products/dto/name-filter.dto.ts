import { ApiProperty } from '@nestjs/swagger';
import { CategoryFilterDto } from './category-filter.dto';
import { IsString } from 'class-validator';

export class NameFilterDto extends CategoryFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string | null;
}
