import { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyBalanceChart from './WeeklyBalanceChart';
import { useTheme } from '../context/ThemeContext';

const BalanceView = () => {
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('COP');
  const [productList, setProductList] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');

  const { theme } = useTheme(); // obtener el tema actual

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:3000/balance');
        setBalance(res.data.balance);
        setCurrency(res.data.currency || 'COP');
      } catch (error) {
        console.error('Error fetching total balance:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/sales/products');
        setProductList(res.data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };

    fetchBalance();
    fetchProducts();
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: isDark ? '#1e1e1e' : '#f5f9f6',
        color: isDark ? '#f1f1f1' : '#000',
        borderRadius: '12px',
        boxShadow: isDark ? '0 0 10px #000' : '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <h2>💰 Balance General</h2>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        Total: {balance.toLocaleString()} {currency}
      </p>

      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <label>Producto:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#f1f1f1' : '#000',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '0.3rem',
            }}
          >
            <option value="">Todos</option>
            {productList.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Calidad:</label>
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            style={{
              backgroundColor: isDark ? '#333' : '#fff',
              color: isDark ? '#f1f1f1' : '#000',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '0.3rem',
            }}
          >
            <option value="">Todas</option>
            <option value="primera">Primera</option>
            <option value="segunda">Segunda</option>
            <option value="tercera">Tercera</option>
          </select>
        </div>
      </div>

      {/* Gráfico modular */}
      <WeeklyBalanceChart product={selectedProduct} quality={selectedQuality} />
    </div>
  );
};

export default BalanceView;
