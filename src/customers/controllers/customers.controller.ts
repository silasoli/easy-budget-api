import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../schemas/customer.entity';
import { QueryWithHelpers } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  public async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(dto);
  }

  @Get()
  public async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') _id: string): Promise<Customer> {
    return this.customersService.findOne(_id);
  }

  @Patch(':id')
  public async update(
    @Param('id') _id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.customersService.update(_id, updateCustomerDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.customersService.remove(_id);
  }
}
