import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';
import { Product } from '../schemas/product.entity';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Get()
  public async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Product> {
    ValidationUtil.validObjectId(id);
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(id);
    return this.productsService.update(id, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
