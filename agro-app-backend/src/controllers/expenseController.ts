import { Request, Response } from 'express';
import { createExpense, getExpensesBetweenDates } from '../services/expenseService';
import { ExpenseModel } from '../models/expense';

export const registerExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, description, amount } = req.body;

    if (!date || !description || typeof amount !== 'number') {
      res.status(400).json({ error: 'Missing or invalid fields' });
      return;
    }

    const expense = await createExpense(date, description, amount);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Error registering expense' });
  }
};

export const listExpenses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await getExpensesBetweenDates();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

export const getUniqueDescriptions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const descriptions = await ExpenseModel.distinct('description');
    res.json(descriptions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching descriptions' });
  }
};
