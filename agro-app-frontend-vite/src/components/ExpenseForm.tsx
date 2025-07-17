import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const capitalizeWords = (text: string) =>
  text
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ExpenseForm = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [descriptions, setDescriptions] = useState<string[]>([]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const res = await axios.get<string[]>('http://localhost:3000/expenses/descriptions');
        setDescriptions(res.data);
      } catch (error) {
        console.error('Error cargando descripciones:', error);
      }
    };

    fetchDescriptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/expenses', {
        date,
        description: capitalizeWords(description),
        amount,
      });
      setMessage('✅ Gasto registrado');
      setDate('');
      setDescription('');
      setAmount(0);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error registrando gasto');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        ...formStyle,
        backgroundColor: isDark ? '#2c2c2c' : '#fff5f5',
        color: isDark ? '#f1f1f1' : '#000',
      }}
    >
      <h2>Registrar Gasto</h2>

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

      <div style={fieldStyle}>
        <label><FileText size={16} /> Descripción</label>
        <input
          list="descriptionOptions"
          value={description}
          onChange={(e) => setDescription(capitalizeWords(e.target.value))}
          required
          style={inputStyle(isDark)}
        />
        <datalist id="descriptionOptions">
          {descriptions.map((desc, idx) => (
            <option key={idx} value={desc} />
          ))}
        </datalist>
      </div>

      <div style={fieldStyle}>
        <label><DollarSign size={16} /> Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          required
          style={inputStyle(isDark)}
        />
      </div>

      <button type="submit" style={buttonStyle}>💾 Guardar Gasto</button>
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
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default ExpenseForm;
