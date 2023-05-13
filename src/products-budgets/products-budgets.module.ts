import { Module, forwardRef } from '@nestjs/common';
import {
  ProductsBudget,
  ProductsBudgetSchema,
} from './schemas/products-budget.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsBudgetsController } from './controllers/products-budgets.controller';
import { ProductsBudgetsService } from './services/products-budgets.service';
import { BudgetModule } from '../budget/budget.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductsBudget.name, schema: ProductsBudgetSchema },
    ]),
    forwardRef(() => BudgetModule),
    ProductsModule,
  ],
  controllers: [ProductsBudgetsController],
  providers: [ProductsBudgetsService],
  exports: [ProductsBudgetsService],
})
export class ProductsBudgetsModule {}
