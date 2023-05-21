import { ApiProperty } from '@nestjs/swagger';
import { CategoryFilterDto } from './category-filter.dto';

export class NameFilterDto extends CategoryFilterDto {
  @ApiProperty({ required: false })
  name: string | null;
}
