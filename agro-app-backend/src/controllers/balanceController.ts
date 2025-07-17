import { Request, Response } from 'express';
import { SaleModel } from '../models/sale';
import { ExpenseModel } from '../models/expense';
import dayjs from 'dayjs';

export const getBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupBy, startDate, endDate, product, quality, compareBy } = req.query;

    const start = startDate ? new Date(startDate as string) : null;
    const end = endDate ? new Date(endDate as string) : null;

    const dateFilter: any = {};
    if (start) dateFilter.$gte = start;
    if (end) dateFilter.$lte = end;

    const saleFilter: any = {};
    if (Object.keys(dateFilter).length) saleFilter.date = dateFilter;
    if (product) saleFilter.product = product;
    if (quality) saleFilter.quality = quality;

    const expenseFilter = Object.keys(dateFilter).length ? { date: dateFilter } : {};

    const sales = await SaleModel.find(saleFilter);
    const expenses = await ExpenseModel.find(expenseFilter);

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (groupBy === 'week') {
      if (compareBy === 'product' || compareBy === 'quality') {
        const compareKey = compareBy as 'product' | 'quality';

        const grouped: Record<string, Record<string, { sales: number; expenses: number }>> = {};

        for (const sale of sales) {
          const week = dayjs(sale.date).startOf('week').format('YYYY-MM-DD');
          const key = sale[compareKey];
          if (!grouped[week]) grouped[week] = {};
          if (!grouped[week][key]) grouped[week][key] = { sales: 0, expenses: 0 };
          grouped[week][key].sales += sale.total;
        }

        for (const expense of expenses) {
          const week = dayjs(expense.date).startOf('week').format('YYYY-MM-DD');
          const key = 'Gastos';
          if (!grouped[week]) grouped[week] = {};
          if (!grouped[week][key]) grouped[week][key] = { sales: 0, expenses: 0 };
          grouped[week][key].expenses += expense.amount;
        }

        const weeks: any[] = [];
        for (const week of Object.keys(grouped).sort()) {
          const entry: any = { week };
          for (const key of Object.keys(grouped[week])) {
            entry[`${key}_sales`] = grouped[week][key].sales;
            entry[`${key}_expenses`] = grouped[week][key].expenses;
          }
          weeks.push(entry);
        }

        res.json({
          totalSales,
          totalExpenses,
          balance: totalSales - totalExpenses,
          currency: 'COP',
          weeks,
        });
        return;
      }

      const weeks: {
        week: string;
        sales: number;
        expenses: number;
      }[] = [];

      const getWeekLabel = (dateStr: string) =>
        dayjs(dateStr).startOf('week').format('YYYY-MM-DD');

      for (const sale of sales) {
        const week = getWeekLabel(sale.date);
        const group = weeks.find(w => w.week === week);
        if (group) group.sales += sale.total;
        else weeks.push({ week, sales: sale.total, expenses: 0 });
      }

      for (const expense of expenses) {
        const week = getWeekLabel(expense.date);
        const group = weeks.find(w => w.week === week);
        if (group) group.expenses += expense.amount;
        else weeks.push({ week, sales: 0, expenses: expense.amount });
      }

      res.json({
        totalSales,
        totalExpenses,
        balance: totalSales - totalExpenses,
        currency: 'COP',
        weeks,
      });
      return;
    }

    res.json({
      totalSales,
      totalExpenses,
      balance: totalSales - totalExpenses,
      currency: 'COP',
    });
  } catch (error) {
    console.error('Error en getBalance:', error);
    res.status(500).json({ error: 'Error al calcular el balance' });
  }
};
