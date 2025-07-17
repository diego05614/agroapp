import { Request, Response } from 'express';
import { SaleModel } from '../models/sale';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await SaleModel.distinct('product');
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
