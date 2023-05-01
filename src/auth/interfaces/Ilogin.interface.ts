import mongoose from 'mongoose';

export interface Ilogin {
  _id?: mongoose.ObjectId | string;

  name: string;

  email: string;
}
