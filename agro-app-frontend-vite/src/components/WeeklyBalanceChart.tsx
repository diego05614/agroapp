
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type RawWeeklyData = {
  week: string;
  sales: number;
  expenses: number;
};

type WeeklyDataWithBalance = RawWeeklyData & {
  balance: number;
};

type Props = {
  product?: string;
  quality?: string;
};

const WeeklyBalanceChart = ({ product, quality }: Props) => {
  const [data, setData] = useState<WeeklyDataWithBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:3000/balance', {
          params: {
            groupBy: 'week',
            product: product || undefined,
            quality: quality || undefined,
          },
        });

        const weeks = res.data.weeks || [];
        const withBalance = weeks.map((item: RawWeeklyData) => ({
          ...item,
          balance: item.sales - item.expenses,
        }));

        setData(withBalance);
      } catch (error) {
        console.error('Error al cargar balance semanal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [product, quality]);

  if (loading) return <p>⏳ Cargando datos...</p>;
  if (data.length === 0) return <p>ℹ️ No hay datos para mostrar.</p>;

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#4caf50" name="Ventas" />
          <Bar dataKey="expenses" fill="#f44336" name="Gastos" />
          <Bar dataKey="balance" fill="#2196f3" name="Balance Neto" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyBalanceChart;
