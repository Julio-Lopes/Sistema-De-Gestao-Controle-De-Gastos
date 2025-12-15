import { useState, useEffect } from 'react';
import { categoriasService } from '../services/api';
import type { Categoria, CriarCategoriaRequest, FinalidadeCategoria } from '../types/Index';

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const data = await categoriasService.listar();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      mostrarMensagem('erro', 'Erro ao carregar categorias');
    }
  };

  const mostrarMensagem = (tipo: 'sucesso' | 'erro', texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request: CriarCategoriaRequest = {
        descricao,
        finalidade
      };
      
      await categoriasService.criar(request);
      setDescricao('');
      setFinalidade(1);
      carregarCategorias();
      mostrarMensagem('sucesso', 'Categoria criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      mostrarMensagem('erro', error.response?.data?.message || 'Erro ao criar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const getFinalidadeInfo = (finalidade: FinalidadeCategoria) => {
    switch (finalidade) {
      case 1:
        return { cor: '#ef4444', bg: '#fee2e2', icon: '💸', label: 'Despesa' };
      case 2:
        return { cor: '#10b981', bg: '#d1fae5', icon: '💰', label: 'Receita' };
      case 3:
        return { cor: '#3b82f6', bg: '#dbeafe', icon: '🔄', label: 'Ambas' };
      default:
        return { cor: '#6b7280', bg: '#f3f4f6', icon: '❓', label: 'Desconhecido' };
    }
  };

  const categoriasPorFinalidade = {
    despesas: categorias.filter(c => c.finalidade === 1),
    receitas: categorias.filter(c => c.finalidade === 2),
    ambas: categorias.filter(c => c.finalidade === 3)
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Gerenciar Categorias
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>Organize suas transações em categorias</p>
      </div>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <div style={{
          background: mensagem.tipo === 'sucesso' 
            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: mensagem.tipo === 'sucesso' ? '#065f46' : '#991b1b',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{mensagem.tipo === 'sucesso' ? '✅' : '❌'}</span>
          {mensagem.texto}
        </div>
      )}

      {/* Formulário de Cadastro */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.5rem' }}>
          Nova Categoria
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Descrição
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                maxLength={100}
                placeholder="Ex: Alimentação, Salário, Aluguel..."
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Finalidade
              </label>
              <select
                value={finalidade}
                onChange={(e) => setFinalidade(parseInt(e.target.value) as FinalidadeCategoria)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value={1}>💸 Despesa</option>
                <option value={2}>💰 Receita</option>
                <option value={3}>🔄 Ambas</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: isLoading 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.875rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {isLoading ? '⏳ Cadastrando...' : '➕ Cadastrar Categoria'}
          </button>
        </form>
      </div>

      {/* Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.25rem' }}>
            {categoriasPorFinalidade.despesas.length}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Categorias de Despesa</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
            {categoriasPorFinalidade.receitas.length}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Categorias de Receita</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          border: '1px solid #f0f0f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.25rem' }}>
            {categoriasPorFinalidade.ambas.length}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Categorias Mistas</div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.5rem' }}>
          Todas as Categorias ({categorias.length})
        </h3>

        {categorias.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏷️</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nenhuma categoria cadastrada</p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Crie sua primeira categoria usando o formulário acima</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {categorias.map((categoria) => {
              const info = getFinalidadeInfo(categoria.finalidade);
              return (
                <div
                  key={categoria.id}
                  style={{
                    background: info.bg,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: `2px solid ${info.cor}22`,
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${info.cor}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: info.cor
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <span style={{ fontSize: '2rem' }}>{info.icon}</span>
                      <div>
                        <div style={{ 
                          fontWeight: '700', 
                          fontSize: '1.05rem', 
                          color: '#1a1a1a',
                          marginBottom: '0.25rem'
                        }}>
                          {categoria.descricao}
                        </div>
                        <span style={{
                          background: `${info.cor}33`,
                          color: info.cor,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {info.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Informação sobre finalidades */}
      <div style={{
        marginTop: '2rem',
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #93c5fd'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>ℹ️</span>
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontWeight: '700' }}>
              Sobre as Finalidades
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e3a8a' }}>
              <li><strong>Despesa:</strong> Apenas para transações de saída (gastos)</li>
              <li><strong>Receita:</strong> Apenas para transações de entrada (ganhos)</li>
              <li><strong>Ambas:</strong> Pode ser usada tanto para despesas quanto para receitas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
