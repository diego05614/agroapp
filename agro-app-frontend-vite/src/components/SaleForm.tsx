import { useState, useEffect } from 'react';
import axios from 'axios';
import { PackageCheck, Tag, Weight, Calendar, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SaleForm = () => {
  const [product, setProduct] = useState('');
  const [productList, setProductList] = useState<string[]>([]);
  const [quality, setQuality] = useState('');
  const [unit, setUnit] = useState<'kg' | 'caja'>('kg');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<string[]>('http://localhost:3000/products');
        setProductList(res.data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedProduct = capitalize(product);
      const res = await axios.post('http://localhost:3000/sales', {
        product: formattedProduct,
        quality,
        unit,
        unitPrice: price,
        quantity,
        total: price * quantity,
        date,
      });
      setMessage(`✅ Venta registrada: ${res.data.total.toLocaleString()} COP`);
      setProduct('');
      setQuality('');
      setUnit('kg');
      setPrice(0);
      setQuantity(0);
      setDate('');
    } catch (error) {
      console.error(error);
      setMessage('❌ Error registrando venta');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        ...formStyle,
        backgroundColor: isDark ? '#1e1e1e' : '#f4fdf6',
        color: isDark ? '#f1f1f1' : '#000',
      }}
    >
      <h2>Registrar Venta</h2>

      <div style={fieldStyle}>
        <label><PackageCheck size={16} /> Producto</label>
        <input
          list="products"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
          style={inputStyle(isDark)}
        />
        <datalist id="products">
          {productList.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>

      <div style={fieldStyle}>
        <label><Tag size={16} /> Calidad</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          required
          style={inputStyle(isDark)}
        >
          <option value="">Selecciona...</option>
          <option value="primera">Primera</option>
          <option value="segunda">Segunda</option>
          <option value="tercera">Caregato (Caja)</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label><Weight size={16} /> Unidad</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as 'kg' | 'caja')}
          required
          style={inputStyle(isDark)}
        >
          <option value="kg">Kilos</option>
          <option value="caja">Caja</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label><DollarSign size={16} /> Precio por unidad (COP)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          required
          style={inputStyle(isDark)}
        />
      </div>

      <div style={fieldStyle}>
        <label><Weight size={16} /> Cantidad</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(+e.target.value)}
          required
          style={inputStyle(isDark)}
        />
      </div>

      <div style={fieldStyle}>
        <label><Calendar size={16} /> Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle(isDark)}
        />
      </div>

      <button type="submit" style={buttonStyle}>💾 Guardar Venta</button>
      {message && <p>{message}</p>}
    </form>
  );
};

// Estilos
const formStyle: React.CSSProperties = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '1rem',
  borderRadius: '12px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
};

const inputStyle = (isDark: boolean): React.CSSProperties => ({
  backgroundColor: isDark ? '#333' : '#fff',
  color: isDark ? '#f1f1f1' : '#000',
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '0.4rem',
});

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default SaleForm;
