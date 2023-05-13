import { Test, TestingModule } from '@nestjs/testing';
import { ProductsBudgetsController } from './products-budgets.controller';
import { ProductsBudgetsService } from '../services/products-budgets.service';

describe('ProductsBudgetsController', () => {
  let controller: ProductsBudgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsBudgetsController],
      providers: [ProductsBudgetsService],
    }).compile();

    controller = module.get<ProductsBudgetsController>(
      ProductsBudgetsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
