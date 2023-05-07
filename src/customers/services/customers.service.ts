import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer, CustomerDocument } from '../schemas/customer.entity';
import { Model, QueryWithHelpers } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
  ) {}

  public async create(dto: CreateCustomerDto): Promise<Customer> {
    return this.customerModel.create(dto);
  }

  public async findAll(): Promise<Customer[]> {
    return this.customerModel.find();
  }

  private async findCustomerByID(_id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(_id);

    if (!customer) throw new NotFoundException('Customer not found');

    return customer;
  }

  public async findOne(_id: string): Promise<Customer> {
    return this.findCustomerByID(_id);
  }

  public async update(
    _id: string,
    dto: UpdateCustomerDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findCustomerByID(_id);

    // await this.validUpdate(_id, dto);

    const rawData = { ...dto };

    return this.customerModel.updateOne({ _id }, rawData);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.customerModel.deleteOne({ _id });
  }
}
