import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/usuarios/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    })
      .then((res) => {
        if (res.ok) {
          setMensagem('Cadastro realizado! Redirecionando...');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setMensagem('Erro: Email já cadastrado.');
        }
      })
      .catch(() => {
        setMensagem('Erro ao conectar com o servidor.');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        <form onSubmit={handleCadastro} style={styles.card}>

            <h1 style={styles.nomeApp}>TaskStudy</h1>
          <h2 style={styles.titulo}>Cadastro</h2>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.botaoPrincipal}>
            Cadastrar
          </button>

          {mensagem && (
            <p
              style={{
                color: mensagem.includes('Erro') ? 'red' : 'green',
                marginTop: '10px',
              }}
            >
              {mensagem}
            </p>
          )}

          <p style={styles.textoLink}>
            Já tem conta?{' '}
            <Link to="/login" style={styles.link}>
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e3f2fd',
    fontFamily: 'Arial, sans-serif',
  },
  wrapper: {
    textAlign: 'center',
  },
  nomeApp: {
    fontSize: '32px',
    color: '#0d47a1',
    marginBottom: '20px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  }, 
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '100%',
  },
  titulo: {
    marginBottom: '20px',
    color: '#1976d2',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  botaoPrincipal: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '10px',
  },
  textoLink: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default CadastroUsuario;
