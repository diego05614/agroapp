import { Schema, model } from 'mongoose';

export type Quality = 'primera' | 'segunda' | 'tercera';
export type Unit = 'kg' | 'caja';

const saleSchema = new Schema({
  date: { type: String, required: true },
  product: { type: String, required: true },
  quality: { type: String, enum: ['primera', 'segunda', 'tercera'], required: true },
  unit: { type: String, enum: ['kg', 'caja'], required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

export const SaleModel = model('Sale', saleSchema);
