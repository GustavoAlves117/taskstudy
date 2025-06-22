import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Header from './Header';
import './styles.css';



const STATUS_LIST = ['Pendente', 'Em andamento', 'Concluída'];
const prioridadeColors = {
  1: '#a2d5ab',
  2: '#f7f08a',
  3: '#f28b82',
};

function ListaTarefas({ usuarioId }) {
  const [tarefas, setTarefas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    dataEntrega: '',
    categoria: '',
    status: '',
    prioridade: 1,
  });

  useEffect(() => {
    if (usuarioId) carregarTarefas();
  }, [usuarioId]);

  const carregarTarefas = () => {
    fetch(`http://localhost:8080/tarefas/usuario/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        setTarefas(data);
        setMensagem(`Foram encontradas ${data.length} tarefas.`);
      })
      .catch(() => {
        setMensagem('Erro ao buscar tarefas.');
        setTarefas([]);
      });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const tarefaId = parseInt(draggableId);
    const novaStatus = destination.droppableId;

    // Para atualizar só o status, buscaria a tarefa atual para enviar completa
    const tarefaAtual = tarefas.find((t) => t.id === tarefaId);
    if (!tarefaAtual) return;

    const tarefaAtualizada = { ...tarefaAtual, status: novaStatus };

    fetch(`http://localhost:8080/tarefas/${tarefaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaAtualizada),
    })
      .then((res) => {
        if (res.ok) carregarTarefas();
        else alert('Erro ao atualizar status da tarefa');
      })
      .catch(() => alert('Erro ao conectar com o servidor'));
  };

  const handleDeletarTarefa = (id) => {
    if (!window.confirm('Tem certeza que quer deletar essa tarefa?')) return;

    fetch(`http://localhost:8080/tarefas/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          if (tarefaSelecionada?.id === id) setTarefaSelecionada(null);
          carregarTarefas();
        } else {
          alert('Erro ao deletar tarefa');
        }
      })
      .catch(() => alert('Erro ao conectar com o servidor'));
  };

  const abrirModalEdicao = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const fecharModalEdicao = () => {
    setTarefaSelecionada(null);
  };

  const handleSalvarEdicao = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/tarefas/${tarefaSelecionada.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaSelecionada),
    })
      .then((res) => {
        if (res.ok) {
          fecharModalEdicao();
          carregarTarefas();
        } else {
          alert('Erro ao atualizar tarefa');
        }
      })
      .catch(() => alert('Erro ao conectar com o servidor'));
  };

  const handleChangeEdicao = (field, value) => {
    setTarefaSelecionada({ ...tarefaSelecionada, [field]: value });
  };

  const handleCriarTarefa = (e) => {
    e.preventDefault();
    const tarefaParaEnviar = { ...novaTarefa, usuario: { id: usuarioId } };

    fetch('http://localhost:8080/tarefas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaParaEnviar),
    })
      .then((res) => {
        if (res.ok) {
          setNovaTarefa({
            titulo: '',
            descricao: '',
            dataEntrega: '',
            categoria: '',
            status: '',
            prioridade: 1,
          });
          setMostrarModalCriar(false);
          carregarTarefas();
        } else {
          alert('Erro ao cadastrar tarefa');
        }
      })
      .catch(() => alert('Erro ao conectar com o servidor'));
  };

  const tarefasPorStatus = STATUS_LIST.reduce((acc, status) => {
    acc[status] = tarefas.filter((t) => t.status === status);
    return acc;
  }, {});

  return (
    <div style={pageContainer}>
      <Header />
      <h2 style={tituloPrincipal}>Kanban de Tarefas</h2>
      {mensagem && <p style={mensagemEstilo}>{mensagem}</p>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={kanbanContainer}>
          {STATUS_LIST.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...kanbanColuna,
                    backgroundColor: snapshot.isDraggingOver ? '#d0e7ff' : '#f9f9f9',
                    borderColor: snapshot.isDraggingOver ? '#1976d2' : '#ddd',
                  }}
                >
                  <h3 style={colunaTitulo}>{status}</h3>

                  {tarefasPorStatus[status].map((tarefa, index) => (
                    <Draggable key={tarefa.id} draggableId={tarefa.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => abrirModalEdicao(tarefa)}
                          style={{
                            ...cardEstilo,
                            backgroundColor: prioridadeColors[tarefa.prioridade] || '#fff',
                            boxShadow: snapshot.isDragging
                              ? '0 12px 24px rgba(0,0,0,0.25)'
                              : '0 4px 10px rgba(0,0,0,0.1)',
                            zIndex: snapshot.isDragging ? 1000 : 'auto',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <h4 style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#222' }}>
                            {tarefa.titulo}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>
                            Prioridade:{' '}
                            {tarefa.prioridade === 1
                              ? 'Baixa'
                              : tarefa.prioridade === 2
                              ? 'Média'
                              : 'Alta'}
                          </p>

                          <button
                            style={btnDeletar}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletarTarefa(tarefa.id);
                            }}
                            title="Deletar tarefa"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal Criar Tarefa */}
      {mostrarModalCriar && (
        <div style={modalFundo}>
          <div style={modalEstilo}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>Nova Tarefa</h3>
            <form onSubmit={handleCriarTarefa}>
              <input
                style={inputEstilo}
                type="text"
                placeholder="Título"
                value={novaTarefa.titulo}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                required
                autoFocus
              />
              <textarea
                style={textareaEstilo}
                placeholder="Descrição"
                value={novaTarefa.descricao}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                required
              />
              <input
                style={inputEstilo}
                type="date"
                value={novaTarefa.dataEntrega}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, dataEntrega: e.target.value })}
                required
              />
              <select
                style={selectEstilo}
                value={novaTarefa.categoria}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, categoria: e.target.value })}
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="Estudos">Estudos</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Saúde">Saúde</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Outros">Outros</option>
              </select>
              <select
                style={selectEstilo}
                value={novaTarefa.status}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, status: e.target.value })}
                required
              >
                <option value="">Selecione o status</option>
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
              </select>
              <select
                style={selectEstilo}
                value={novaTarefa.prioridade}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: parseInt(e.target.value) })}
                required
              >
                <option value="">Selecione a prioridade</option>
                <option value="1">Baixa</option>
                <option value="2">Média</option>
                <option value="3">Alta</option>
              </select>
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
                <button style={btnSalvar} type="submit">
                  Salvar
                </button>
                <button style={btnCancelar} type="button" onClick={() => setMostrarModalCriar(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Tarefa */}
      {tarefaSelecionada && (
        <div style={modalFundo}>
          <div style={modalEstilo}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>Detalhes da Tarefa</h3>
            <form onSubmit={handleSalvarEdicao}>
              <label>
                Título:
                <input
                  style={inputEstilo}
                  type="text"
                  value={tarefaSelecionada.titulo}
                  onChange={(e) => handleChangeEdicao('titulo', e.target.value)}
                  required
                  autoFocus
                />
              </label>
              <label>
                Descrição:
                <textarea
                  style={textareaEstilo}
                  value={tarefaSelecionada.descricao}
                  onChange={(e) => handleChangeEdicao('descricao', e.target.value)}
                  required
                />
              </label>
              <label>
                Data de Entrega:
                <input
                  style={inputEstilo}
                  type="date"
                  value={tarefaSelecionada.dataEntrega}
                  onChange={(e) => handleChangeEdicao('dataEntrega', e.target.value)}
                  required
                />
              </label>
              <label>
                Categoria:
                <select
                  style={selectEstilo}
                  value={tarefaSelecionada.categoria}
                  onChange={(e) => handleChangeEdicao('categoria', e.target.value)}
                  required
                >
                  <option value="">Selecione a categoria</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Pessoal">Pessoal</option>
                  <option value="Outros">Outros</option>
                </select>
              </label>
              <label>
                Status:
                <select
                  style={selectEstilo}
                  value={tarefaSelecionada.status}
                  onChange={(e) => handleChangeEdicao('status', e.target.value)}
                  required
                >
                  <option value="">Selecione o status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </label>
              <label>
                Prioridade:
                <select
                  style={selectEstilo}
                  value={tarefaSelecionada.prioridade}
                  onChange={(e) => handleChangeEdicao('prioridade', parseInt(e.target.value))}
                  required
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="1">Baixa</option>
                  <option value="2">Média</option>
                  <option value="3">Alta</option>
                </select>
              </label>
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
                <button style={btnSalvar} type="submit">
                  Salvar
                </button>
                <button style={btnCancelar} type="button" onClick={fecharModalEdicao}>
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        style={btnCadastrar}
        onClick={() => setMostrarModalCriar(true)}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#115293')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
        title="+ Cadastrar Tarefa"
      >
        + Cadastrar Tarefa
      </button>
    </div>
  );
}

// Estilos atualizados


const pageContainer = {
  padding: '20px 40px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  background:
    'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
  minHeight: '100vh',
  boxSizing: 'border-box',
};

const tituloPrincipal = {
  textAlign: 'center',
  color: '#1976d2',
  fontWeight: '700',
  fontSize: '2.4rem',
  marginBottom: '5px',
  userSelect: 'none',
};

const mensagemEstilo = {
  textAlign: 'center',
  fontStyle: 'italic',
  color: '#555',
  marginBottom: '20px',
  userSelect: 'none',
};

const kanbanContainer = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
};

const kanbanColuna = {
  flex: '1 1 320px',
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '12px',
  minHeight: '350px',
  maxHeight: '75vh',
  overflowY: 'auto',
  boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  border: '2px solid #ddd',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
  userSelect: 'none',
};

const colunaTitulo = {
  textAlign: 'center',
  color: '#1976d2',
  borderBottom: '3px solid #1976d2',
  paddingBottom: '10px',
  fontSize: '1.3rem',
  fontWeight: '700',
  userSelect: 'none',
};

const cardEstilo = {
  borderRadius: '10px',
  padding: '15px 20px',
  marginBottom: '15px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  position: 'relative',
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
  userSelect: 'none',
};

const btnCadastrar = {
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  cursor: 'pointer',
  marginTop: '40px',
  marginBottom: '30px',
  fontWeight: '700',
  fontSize: '1.1rem',
  boxShadow: '0 5px 12px rgba(25, 118, 210, 0.5)',
  transition: 'background-color 0.3s ease',
  userSelect: 'none',
};

const btnDeletar = {
  backgroundColor: '#d32f2f',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '50%',
  cursor: 'pointer',
  position: 'absolute',
  top: '12px',
  right: '12px',
  fontWeight: 'bold',
  fontSize: '1rem',
  lineHeight: '1',
  userSelect: 'none',
  transition: 'background-color 0.3s ease',
};

const btnSalvar = {
  backgroundColor: '#388e3c',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '30px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '1rem',
  userSelect: 'none',
  boxShadow: '0 4px 8px rgba(56, 142, 60, 0.6)',
  transition: 'background-color 0.3s ease',
};

const btnCancelar = {
  backgroundColor: '#757575',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '30px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '1rem',
  userSelect: 'none',
  boxShadow: '0 4px 8px rgba(117, 117, 117, 0.6)',
  transition: 'background-color 0.3s ease',
};

const modalFundo = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  userSelect: 'none',
  animation: 'fadeInModal 0.3s ease',
};

const modalEstilo = {
  backgroundColor: '#fff',
  borderRadius: '15px',
  padding: '30px 25px',
  width: '420px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  position: 'relative',
  userSelect: 'none',
};

// Inputs e selects com mais espaçamento
const inputEstilo = {
  width: '100%',
  padding: '12px 14px',
  marginBottom: '18px',
  borderRadius: '8px',
  border: '1.5px solid #bbb',
  fontSize: '15px',
  transition: 'border-color 0.3s ease',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const textareaEstilo = {
  width: '100%',
  height: '80px',
  padding: '12px 14px',
  marginBottom: '18px',
  borderRadius: '8px',
  border: '1.5px solid #bbb',
  fontSize: '15px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  resize: 'vertical',
};

const selectEstilo = {
  width: '100%',
  padding: '12px 14px',
  marginBottom: '18px',
  borderRadius: '8px',
  border: '1.5px solid #bbb',
  fontSize: '15px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  cursor: 'pointer',
};


export default ListaTarefas;