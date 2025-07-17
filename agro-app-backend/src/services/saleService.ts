import { SaleModel } from '../models/sale';

export const createSale = async (
  date: string,
  product: string,
  quality: string,
  unit: string,
  unitPrice: number,
  quantity: number
) => {
  const total = unitPrice * quantity;
  const newSale = new SaleModel({ date, product, quality, unit, unitPrice, quantity, total });
  return await newSale.save();
};

export const getSalesBetweenDates = async (from?: string, to?: string) => {
  const query: any = {};
  if (from && to) {
    query.date = { $gte: from, $lte: to };
  }
  return await SaleModel.find(query);
};
