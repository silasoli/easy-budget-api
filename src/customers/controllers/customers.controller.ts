import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../schemas/customer.entity';
import { QueryWithHelpers } from 'mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { ValidationUtil } from '../../common/validations.util';

@ApiBearerAuth()
@ApiTags('Customers')
@Controller('customers')
@UseGuards(AuthUserJwtGuard)
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

  @Get('names')
  public async findAllNames(): Promise<Customer[]> {
    return this.customersService.findAllNames();
  }

  @Get(':id')
  public async findOne(@Param('id') _id: string): Promise<Customer> {
    ValidationUtil.validObjectId(_id);
    return this.customersService.findOne(_id);
  }

  @Patch(':id')
  public async update(
    @Param('id') _id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.customersService.update(_id, updateCustomerDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(_id);
    return this.customersService.remove(_id);
  }
}
