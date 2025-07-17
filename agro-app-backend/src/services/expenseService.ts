import { ExpenseModel } from '../models/expense';

export const createExpense = async (
  date: string,
  description: string,
  amount: number
) => {
  const formattedDescription =
    description.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); // Ej: "transporte" → "Transporte"

  const expense = new ExpenseModel({ date, description: formattedDescription, amount });
  return await expense.save();
};

export const getExpensesBetweenDates = async () => {
  return await ExpenseModel.find().sort({ date: -1 });
};
