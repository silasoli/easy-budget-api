import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import {
  MaterialCategoriesEnum,
  MaterialCategoriesLabels,
} from '../enum/material-categories.enum';

@ApiBearerAuth()
@ApiTags('Material-categories')
@Controller('material-categories')
@UseGuards(AuthUserJwtGuard)
export class MaterialCategoriesController {
  @Get()
  public async findAllCategories() {
    return Object.keys(MaterialCategoriesEnum).map((key) => {
      return MaterialCategoriesLabels[key];
    });
  }
}
