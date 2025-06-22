import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o ID do usuário salvo na sessão/localStorage
    sessionStorage.removeItem('usuarioId');
    navigate('/login');
  };

  return (
    <header style={headerEstilo}>
      <h1 style={titulo}>TaskStudy</h1>
      <button onClick={handleLogout} style={botaoSair}>
        Sair
      </button>
    </header>
  );
}

const headerEstilo = {
  backgroundColor: '#1976d2',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
};

const titulo = {
  margin: 0,
  fontSize: '24px',
};

const botaoSair = {
  backgroundColor: 'white',
  color: '#1976d2',
  border: 'none',
  borderRadius: '5px',
  padding: '8px 12px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default Header;
