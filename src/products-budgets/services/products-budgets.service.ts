import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  ProductsBudget,
  ProductsBudgetDocument,
} from '../schemas/products-budget.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, QueryWithHelpers } from 'mongoose';
import { CreateProductsBudgetDto } from '../dto/create-products-budget.dto';
import { BudgetService } from '../../budget/services/budget.service';
import { ProductsService } from '../../products/services/products.service';
import { UpdateProductsBudgetDto } from '../dto/update-products-budget.dto';
import { Budget } from '../../budget/schemas/budget.entity';
import * as pdf from 'html-pdf';
import { AggregateUtil } from '../../common/aggregate.util';

@Injectable()
export class ProductsBudgetsService {
  constructor(
    @InjectModel(ProductsBudget.name)
    private productsBudgetModel: Model<ProductsBudgetDocument>,
    @Inject(forwardRef(() => BudgetService))
    private budgetService: BudgetService,
    private productService: ProductsService,
  ) {}

  private async findProductInBudget(
    budgetId: string,
    productId: string,
  ): Promise<void> {
    const item = await this.productsBudgetModel.findOne({
      budgetId,
      productId,
    });
    if (item) throw new BadRequestException('Item já adicionado!');
  }

  private async validProductCategory(
    budget: Budget,
    dto: CreateProductsBudgetDto,
  ): Promise<void> {
    const product = await this.productService.findOne(dto.productId);
    const verify = product.category.key === budget.category.key;
    const message = 'Categoria do Produto diferente da categoria do orçamento';
    if (!verify) throw new BadRequestException(message);
  }

  private async validCreate(dto: CreateProductsBudgetDto): Promise<void> {
    const budget = await this.budgetService.findOne(dto.budgetId);

    await this.validProductCategory(budget, dto);

    await this.findProductInBudget(dto.budgetId, dto.productId);
  }

  public async create(dto: CreateProductsBudgetDto): Promise<ProductsBudget> {
    await this.validCreate(dto);

    return this.productsBudgetModel.create(dto);
  }

  public async findAllProductsByBudget(_id: string): Promise<ProductsBudget[]> {
    await this.budgetService.findOne(_id);

    return this.productsBudgetModel.find({ budgetId: _id });
  }

  private async findProductsBudgetByID(_id: string): Promise<ProductsBudget> {
    const item = await this.productsBudgetModel.findById(_id);

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  public async findOne(_id: string): Promise<ProductsBudget> {
    return this.findProductsBudgetByID(_id);
  }

  public async update(
    _id: string,
    dto: UpdateProductsBudgetDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    await this.findOne(_id);

    return this.productsBudgetModel.updateOne({ _id }, dto);
  }

  public async remove(
    _id: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.productsBudgetModel.deleteOne({ _id });
  }

  public async removeAllProductsBudgetByBudget(
    budgetId: string,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.productsBudgetModel.deleteMany({ budgetId });
  }

  public async generatePdf(_id: string): Promise<Buffer> {
    const header = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Orçamento</title>
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid #ddd;
      }
      th {
        background-color: #f2f2f2;
      }
      .total {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Orçamento</h1>
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Marca</th>
          <th>Quantidade</th>
          <th>Preço</th>
          <th>Total</th>
        </tr>
      </thead>`;

    const items = [
      {
        productName: 'teste1',
        productBrand: 'teste orcamento',
        quantity: 1,
        price: 10,
        amount: 10,
      },
      {
        productName: 'teste2',
        productBrand: 'teste orcamento',
        quantity: 2,
        price: 12.5,
        amount: 25,
      },
    ];

    let itemsHtml = '';
    for (let i = 0; i < items.length; i++) {
      itemsHtml += `
    <tr>
      <td>${items[i].productName}</td>
      <td>${items[i].productBrand}</td>
      <td>${items[i].quantity}</td>
      <td>${items[i].price}</td>
      <td>${items[i].amount}</td>
    </tr>
  `;
    }

    const body = ` <tbody>
      ${itemsHtml}
              <tr>
          <td class="total" colspan="3">Total</td>
          <td class="total">R$ {{totalAmount}}</td>
        </tr>
    </tbody>
     </table>
  </body>
</html>`;

    const html = `${header}${body}`;

    const options = { format: 'A4' };

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      pdf.create(html, options).toBuffer((err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    });

    return pdfBuffer;
  }

  public async calcAmountsByBudget(
    _id: string,
  ): Promise<Aggregate<Array<unknown>>> {
    const query = AggregateUtil.queryAmountsByBudget(_id);
    return this.productsBudgetModel.aggregate(query);
  }
}
