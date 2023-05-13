import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Budget } from '../../budget/schemas/budget.entity';
import { Product } from '../../products/schemas/product.entity';

export type ProductsBudgetDocument = ProductsBudget & Document;

@Schema()
export class ProductsBudget {
  _id?: mongoose.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: true,
  })
  budgetId: Budget;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: Product;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const ProductsBudgetSchema =
  SchemaFactory.createForClass(ProductsBudget);
