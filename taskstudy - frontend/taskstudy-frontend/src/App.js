import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginUsuario from './LoginUsuario';
import CadastroUsuario from './CadastroUsuario';
import ListaTarefas from './ListaTarefas';

function TarefasComLogout({ usuarioLogado, setUsuarioLogado }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsuarioLogado(null);
    navigate('/login');
  };

  return (
    <div>
      <ListaTarefas usuarioId={usuarioLogado.id} />
    </div>
  );
}

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={<LoginUsuario setUsuarioLogado={setUsuarioLogado} />}
      />

      <Route path="/registro" element={<CadastroUsuario />} />

      <Route
        path="/tarefas"
        element={
          usuarioLogado ? (
            <TarefasComLogout
              usuarioLogado={usuarioLogado}
              setUsuarioLogado={setUsuarioLogado}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
