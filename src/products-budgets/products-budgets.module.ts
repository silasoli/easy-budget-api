import { Module } from '@nestjs/common';
import {
  ProductsBudget,
  ProductsBudgetSchema,
} from './schemas/products-budget.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsBudgetsController } from './controllers/products-budgets.controller';
import { ProductsBudgetsService } from './services/products-budgets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductsBudget.name, schema: ProductsBudgetSchema },
    ]),
  ],
  controllers: [ProductsBudgetsController],
  providers: [ProductsBudgetsService],
})
export class ProductsBudgetsModule {}
