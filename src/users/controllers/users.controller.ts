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
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../schemas/user.entity';
import { ValidationUtil } from '../../common/validations.util';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { QueryWithHelpers } from 'mongoose';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserJwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('names')
  public async findAllNames(): Promise<User[]> {
    return this.usersService.findAllNames();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User> {
    ValidationUtil.validObjectId(id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    ValidationUtil.validObjectId(id);
    return this.usersService.remove(id);
  }
}
