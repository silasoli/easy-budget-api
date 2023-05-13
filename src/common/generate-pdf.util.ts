import { Budget } from '../budget/schemas/budget.entity';
import { ICalcAmount } from '../products-budgets/interfaces/ICalcAmount.interface';
import { FormatUtil } from './format.util';

class GeneratePDFCls {
  generateHead(budget: Budget): string {
    const createDate = FormatUtil.formatDate(budget.createdAt);
    const header = `
    <!DOCTYPE html>
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
        <body style="border-style: solid; padding-bottom: 15px;">
            <h1 style="text-align: center;">Orçamento</h1>
        <div style="margin: 0; padding-left: 15px;">
            <p>Nome: ${budget.name}</p>
            <p>Vendedor: ${budget.sellerId.name}</p>
            <p>Cliente: ${budget.customerId.name}</p>
            <p>Categoria: ${budget.category.label}</p>
            <p>Data de Criação: ${createDate}</p>
        </div>
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
    return header;
  }
  generateTableOfItems(items: any): string {
    let itemsHtml = '';

    for (const item of items) {
      itemsHtml += `
            <tr>
                <td>${item.productName}</td>
                <td>${item.productBrand}</td>
                <td>${item.quantity}</td>
                <td>R$ ${item.price}</td>
                <td>R$ ${item.amount}</td>
            </tr>`;
    }

    return itemsHtml;
  }
  generateFooter(data: ICalcAmount, items: string): string {
    const footer = ` 
        <tbody>
            ${items}
        <tr>
          <td class="total">${data.count} Produtos</td>
          <td></td>
          <td class="total">${data.totalQuantity} Itens</td>
          <td></td>
          <td class="total">R$ ${data.totalAmount}</td>
        </tr>
        </tbody>
        </table>
        </body>
    </html>`;

    return footer;
  }
}

export const GeneratePDFUtil = new GeneratePDFCls();
