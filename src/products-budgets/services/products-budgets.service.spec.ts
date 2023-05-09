import { Test, TestingModule } from '@nestjs/testing';
import { ProductsBudgetsService } from './products-budgets.service';

describe('ProductsBudgetsService', () => {
  let service: ProductsBudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsBudgetsService],
    }).compile();

    service = module.get<ProductsBudgetsService>(ProductsBudgetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
