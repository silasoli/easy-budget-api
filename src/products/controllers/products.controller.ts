import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../services/products.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryWithHelpers } from 'mongoose';
import { ValidationUtil } from '../../common/validations.util';
import { Product } from '../schemas/product.entity';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { CategoryFilterDto } from '../dto/category-filter.dto';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
@UseGuards(AuthUserJwtGuard)
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

  @Get('names')
  public async findAllNames(): Promise<Product[]> {
    return this.productsService.findAllNames();
  }

  @Get('category')
  public async findAllByCategory(
    @Query() query: CategoryFilterDto,
  ): Promise<Product[]> {
    return this.productsService.findAllByCategory(query);
  }

  @Get(':id')
  public async findOne(@Param('id') _id: string): Promise<Product> {
    ValidationUtil.validObjectId(_id);
    return this.productsService.findOne(_id);
  }

  @Patch(':id')
  public async update(
    @Param('id') _id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.productsService.update(_id, dto);
  }

  // @Delete(':id')
  // public async remove(
  //   @Param('id') _id: string,
  // ): Promise<QueryWithHelpers<unknown, unknown>> {
  // ValidationUtil.validObjectId(id);
  //   return this.productsService.remove(_id);
  // }
}
