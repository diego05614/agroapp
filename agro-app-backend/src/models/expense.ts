import { Schema, model } from 'mongoose';

const expenseSchema = new Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

export const ExpenseModel = model('Expense', expenseSchema);
