import mongoose from 'mongoose';

class AggregateUtilCls {
  queryAmountsByBudget(_id: string): any[] {
    return [
      { $match: { budgetId: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $addFields: {
          amount: { $multiply: ['$quantity', '$product.price'] },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          items: {
            $push: {
              product: '$product',
              quantity: '$quantity',
              amount: '$amount',
            },
          },
        },
      },
      {
        $project: {
          totalQuantity: 1,
          totalAmount: { $sum: '$items.amount' },
          count: { $size: '$items' },
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                productName: '$$item.product.name',
                productBrand: '$$item.product.brand',
                quantity: '$$item.quantity',
                price: '$$item.product.price',
                amount: '$$item.amount',
              },
            },
          },
        },
      },
    ];
  }
}

export const AggregateUtil = new AggregateUtilCls();
