import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryType } from '../../products/schemas/product.entity';
import mongoose from 'mongoose';
import { Customer } from '../../customers/schemas/customer.entity';
import { User } from '../../users/schemas/user.entity';

export type BudgetDocument = Budget & Document;

@Schema()
export class Budget {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sellerId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  })
  customerId: Customer;

  @Prop({ required: true })
  category: CategoryType;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: true })
  active?: boolean;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
