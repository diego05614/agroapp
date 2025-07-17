import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import saleRoutes from './routes/saleRoutes';
import expenseRoutes from './routes/expenseRoutes';
import balanceRoutes from './routes/balanceRoutes';
import productRoutes from './routes/productRoutes'; // si lo necesitas

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/sales', saleRoutes);
app.use('/products', productRoutes);
app.use('/expenses', expenseRoutes);
app.use('/balance', balanceRoutes);

app.get('/', (req, res) => {
  res.send('API AgroApp funcionando ✅');
});

export default app;
