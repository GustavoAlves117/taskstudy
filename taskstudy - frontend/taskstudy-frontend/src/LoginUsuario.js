import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginUsuario({ setUsuarioLogado }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error('Credenciais inválidas');
      })
      .then((usuario) => {
        setUsuarioLogado(usuario);
        navigate('/tarefas');
      })
      .catch((error) => {
        setMensagem(error.message);
      });
  };

return (
  <div style={container}>
    <div style={wrapper}>
      
      <form onSubmit={handleLogin} style={card}>
        <h1 style={nomeApp}>TaskStudy</h1>
        <h2 style={titulo}>Login</h2>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={input}
        />

        <button type="submit" style={botaoPrincipal}>Entrar</button>

        {mensagem && <p style={mensagemErro}>{mensagem}</p>}

        <p style={textoLink}>
          Não tem conta? <Link to="/registro" style={link}>Registre-se aqui</Link>
        </p>
      </form>
    </div>
  </div>
);

}

const wrapper = {
  textAlign: 'center',
};

const nomeApp = {
  fontSize: '32px',
  color: '#0d47a1',
  marginBottom: '20px',
  fontWeight: 'bold',
  letterSpacing: '1px',
};


const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'rgb(227, 242, 253)',
  fontFamily: 'Arial, sans-serif',
};

const card = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  width: '100%',

};

const titulo = {
  textAlign: 'center',
  color: '#1976d2',
  marginBottom: '20px',
};

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const botaoPrincipal = {
  width: '100%',
  backgroundColor: '#1976d2',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const mensagemErro = {
  color: '#d32f2f',
  textAlign: 'center',
  marginTop: '10px',
};

const textoLink = {
  textAlign: 'center',
  marginTop: '15px',
};

const link = {
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 'bold',
};


export default LoginUsuario;
