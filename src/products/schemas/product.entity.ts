import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { MaterialCategoriesEnum } from '../enum/material-categories.enum';

export type ProductDocument = Product & Document;

export class CategoryType {
  @Prop({ type: MaterialCategoriesEnum, required: true })
  key: string;

  @Prop({ required: true })
  label: string;
}

@Schema()
export class Product {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  brand: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: CategoryType;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: true })
  active?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
