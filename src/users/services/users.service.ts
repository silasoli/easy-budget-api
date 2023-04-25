import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  private async validCreate(dto: CreateUserDto): Promise<void> {
    const user = await this.findByEmail(dto.email);
    if (user) throw new BadRequestException('Email already used');
  }

  public async create(dto: CreateUserDto): Promise<User> {
    await this.validCreate(dto);

    return this.userModel.create(dto);
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  private async findUserByID(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findOne(_id: string): Promise<User> {
    return this.findUserByID(_id);
  }

  private async validUpdate(_id: string, dto: UpdateUserDto): Promise<void> {
    if (dto.email) {
      const user = await this.findByEmail(dto.email);
      if (user && String(user._id) != _id)
        throw new BadRequestException('Email já utilizado');
    }
  }

  public async update(_id: string, dto: UpdateUserDto): Promise<any> {
    await this.findUserByID(_id);

    await this.validUpdate(_id, dto);

    return this.userModel.updateOne({ _id }, dto);
  }

  public async remove(_id: string): Promise<any> {
    await this.findUserByID(_id);

    return this.userModel.deleteOne({ _id });
  }
}
