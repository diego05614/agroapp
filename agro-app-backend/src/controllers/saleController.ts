import { Request, Response } from 'express';
import { createSale, getSalesBetweenDates } from '../services/saleService';
import { SaleModel } from '../models/sale';

export const registerSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, product, quality, unit, unitPrice, quantity } = req.body;

    if (!date || !product || !quality || !unit || !unitPrice || !quantity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const sale = await createSale(date, product, quality, unit, unitPrice, quantity);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error registering sale' });
  }
};

export const listSales = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sales = await getSalesBetweenDates();
    res.json(sales);
  } catch (error) {
    console.error('Error al registrar venta:', error);
    res.status(400).json({ error: 'Error al registrar venta', details: error });
  }
};

export const getProductList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await SaleModel.distinct('product');
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
