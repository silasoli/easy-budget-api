import { OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
export class UpdateProductDto extends OmitType(CreateProductDto, [
  'category',
] as const) {}
