import { useState } from 'react';
import SaleForm from '../components/SaleForm';
import ExpenseForm from '../components/ExpenseForm';
import BalanceView from '../components/BalanceView';
import { useTheme } from '../context/ThemeContext';

type View = 'ventas' | 'gastos' | 'balance';

const Home = () => {
  const [view, setView] = useState<View>('ventas');
  const { toggleTheme } = useTheme();

  return (
    <div style={containerStyle}>
      
      <img
  src="/banner.jpg"
  alt="Banner agrícola"
  style={{
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1rem',
    display: 'block'
  }}
/>


      <h1 style={{ margin: '1rem 0', fontSize: '2rem' }}>🌿 AgroApp</h1>

      <div style={buttonGroupStyle}>
        <button style={buttonStyle} onClick={() => setView('ventas')}>📦 Registrar Venta</button>
        <button style={buttonStyle} onClick={() => setView('gastos')}>💸 Registrar Gasto</button>
        <button style={buttonStyle} onClick={() => setView('balance')}>📊 Ver Balance</button>
        <button style={buttonStyle} onClick={toggleTheme}>🌓 Cambiar Tema</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {view === 'ventas' && <SaleForm />}
        {view === 'gastos' && <ExpenseForm />}
        {view === 'balance' && <BalanceView />}
      </div>
    </div>
  );
};

// Estilos
const containerStyle: React.CSSProperties = {
  padding: '2rem',
  fontFamily: 'sans-serif',
  minHeight: '100vh',
  background: 'var(--bg-color)',
  color: 'var(--text-color)',
};

const bannerStyle: React.CSSProperties = {
  width: '100%',
  height: '250px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '1rem',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Home;
