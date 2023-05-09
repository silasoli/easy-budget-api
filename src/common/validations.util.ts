import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { MaterialCategoriesEnum } from '../products/enum/material-categories.enum';

class ValidationUtilCls {
  validObjectId(_id: string): void {
    if (!isValidObjectId(_id))
      throw new BadRequestException('Invalid Format of ID');
  }

  validCategoryType(materialType: string): void {
    const types = Object.keys(MaterialCategoriesEnum);
    if (!types.includes(materialType))
      throw new BadRequestException('Categoria inválida');
  }
}

export const ValidationUtil = new ValidationUtilCls();
