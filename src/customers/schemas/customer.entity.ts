import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CustomerDocument = Customer & Document;

export class Customer {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, lowercase: true })
  phone: string;

  @Prop({ required: true, unique: true, lowercase: true })
  cpf: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: true })
  active?: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
