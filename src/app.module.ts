import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { BudgetModule } from './budget/budget.module';
import { ProductsBudgetsModule } from './products-budgets/products-budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ProductsModule,
    CustomersModule,
    BudgetModule,
    ProductsBudgetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
