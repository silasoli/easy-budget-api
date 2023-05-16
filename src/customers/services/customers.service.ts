import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  private async findByName(name: string): Promise<Customer> {
    return this.customerModel.findOne({ name: name.toLowerCase() });
  }

  private async findByEmail(email: string): Promise<Customer> {
    return this.customerModel.findOne({ email: email.toLowerCase() });
  }

  private async findByPhone(phone: string): Promise<Customer> {
    return this.customerModel.findOne({ phone: phone.toLowerCase() });
  }

  private async findByCPF(cpf: string): Promise<Customer> {
    return this.customerModel.findOne({ cpf: cpf.toLowerCase() });
  }

  private async validCreate(dto: CreateCustomerDto): Promise<void> {
    const nameReturn = await this.findByName(dto.name);
    if (nameReturn) throw new BadRequestException('Nome já utilizado.');

    const emailReturn = await this.findByEmail(dto.email);
    if (emailReturn) throw new BadRequestException('Email já utilizado.');

    const phoneReturn = await this.findByPhone(dto.phone);
    if (phoneReturn) throw new BadRequestException('Telefone já utilizado.');

    const cpfReturn = await this.findByCPF(dto.cpf);
    if (cpfReturn) throw new BadRequestException('CPF já utilizado.');
  }

  public async create(dto: CreateCustomerDto): Promise<Customer> {
    await this.validCreate(dto);

    return this.customerModel.create(dto);
  }

  public async findAllNames(): Promise<Customer[]> {
    return this.customerModel.find({}, { name: 1 });
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

  private async validUpdate(
    _id: string,
    dto: UpdateCustomerDto,
  ): Promise<void> {
    if (dto.name) {
      const customer = await this.findByName(dto.name);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('Nome já utilizado.');
    }

    if (dto.email) {
      const customer = await this.findByEmail(dto.email);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('Email já utilizado.');
    }

    if (dto.phone) {
      const customer = await this.findByPhone(dto.phone);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('Telefone já utilizado.');
    }

    if (dto.cpf) {
      const customer = await this.findByCPF(dto.cpf);
      if (customer && String(customer._id) != _id)
        throw new BadRequestException('CPF já utilizado.');
    }
  }

  public async update(
    _id: string,
    dto: UpdateCustomerDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findCustomerByID(_id);

    await this.validUpdate(_id, dto);

    const rawData = { ...dto };

    return this.customerModel.updateOne({ _id }, rawData);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.customerModel.deleteOne({ _id });
  }
}
