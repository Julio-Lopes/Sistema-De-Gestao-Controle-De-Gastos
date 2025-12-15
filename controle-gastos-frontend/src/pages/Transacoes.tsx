import { useState, useEffect } from 'react';
import { transacoesService, pessoasService, categoriasService } from '../services/api';
import type { Transacao, CriarTransacaoRequest, Pessoa, Categoria, TipoTransacao } from '../types/Index';

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>(1);
  const [categoriaId, setCategoriaId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 1 | 2>('todas');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [transacoesData, pessoasData, categoriasData] = await Promise.all([
        transacoesService.listar(),
        pessoasService.listar(),
        categoriasService.listar()
      ]);
      
      setTransacoes(transacoesData);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarMensagem('erro', 'Erro ao carregar dados');
    }
  };

  const mostrarMensagem = (tipo: 'sucesso' | 'erro', texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  };

  const categoriasFiltradas = categorias.filter(cat => {
    if (tipo === 1) {
      return cat.finalidade === 1 || cat.finalidade === 3;
    } else {
      return cat.finalidade === 2 || cat.finalidade === 3;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pessoaSelecionada = pessoas.find(p => p.id === parseInt(pessoaId));
    if (!pessoaSelecionada) {
      mostrarMensagem('erro', 'Selecione uma pessoa válida');
      return;
    }

    if (pessoaSelecionada.ehMenorDeIdade && tipo === 2) {
      mostrarMensagem('erro', `${pessoaSelecionada.nome} é menor de idade e não pode ter receitas!`);
      return;
    }

    setIsLoading(true);

    try {
      const request: CriarTransacaoRequest = {
        descricao,
        valor: parseFloat(valor),
        tipo,
        categoriaId: parseInt(categoriaId),
        pessoaId: parseInt(pessoaId)
      };

      await transacoesService.criar(request);
      
      setDescricao('');
      setValor('');
      setTipo(1);
      setCategoriaId('');
      setPessoaId('');
      
      carregarDados();
      mostrarMensagem('sucesso', 'Transação criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao criar transação';
      mostrarMensagem('erro', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const transacoesFiltradas = filtroTipo === 'todas' 
    ? transacoes 
    : transacoes.filter(t => t.tipo === filtroTipo);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 1)
    .reduce((acc, t) => acc + t.valor, 0);

  const totalReceitas = transacoes
    .filter(t => t.tipo === 2)
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Gerenciar Transações
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>Registre suas despesas e receitas</p>
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

      {/* Resumo Financeiro */}
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
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
            {formatarValor(totalReceitas)}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Receitas</div>
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
            background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.25rem' }}>
            {formatarValor(totalDespesas)}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Despesas</div>
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
            background: totalReceitas - totalDespesas >= 0
              ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
              : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
          }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {totalReceitas - totalDespesas >= 0 ? '📊' : '⚠️'}
          </div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            color: totalReceitas - totalDespesas >= 0 ? '#3b82f6' : '#f59e0b',
            marginBottom: '0.25rem' 
          }}>
            {formatarValor(totalReceitas - totalDespesas)}
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Saldo</div>
        </div>
      </div>

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
          Nova Transação
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Descrição
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                maxLength={200}
                placeholder="Ex: Compra de supermercado"
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
                Valor (R$)
              </label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="0,00"
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
                Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => {
                  setTipo(parseInt(e.target.value) as TipoTransacao);
                  setCategoriaId('');
                }}
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
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Pessoa
              </label>
              <select
                value={pessoaId}
                onChange={(e) => setPessoaId(e.target.value)}
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
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome} - {pessoa.idade} anos {pessoa.ehMenorDeIdade ? '(Menor)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
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
                <option value="">Selecione uma categoria</option>
                {categoriasFiltradas.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao} ({categoria.finalidadeTexto})
                  </option>
                ))}
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
            {isLoading ? '⏳ Registrando...' : '➕ Registrar Transação'}
          </button>
        </form>
      </div>

      {/* Lista de Transações */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1a1a1a' }}>
            Histórico de Transações ({transacoesFiltradas.length})
          </h3>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFiltroTipo('todas')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: filtroTipo === 'todas' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#f3f4f6',
                color: filtroTipo === 'todas' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroTipo(2)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: filtroTipo === 2 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#f3f4f6',
                color: filtroTipo === 2 ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              💰 Receitas
            </button>
            <button
              onClick={() => setFiltroTipo(1)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: filtroTipo === 1 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : '#f3f4f6',
                color: filtroTipo === 1 ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              💸 Despesas
            </button>
          </div>
        </div>

        {transacoesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nenhuma transação registrada</p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Crie sua primeira transação usando o formulário acima</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transacoesFiltradas.map((transacao) => (
              <div
                key={transacao.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  background: '#fafafa',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: transacao.tipo === 2 
                      ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                      : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {transacao.tipo === 2 ? '💰' : '💸'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                      {transacao.descricao}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666', flexWrap: 'wrap' }}>
                      <span>👤 {transacao.pessoaNome}</span>
                      <span>🏷️ {transacao.categoriaNome}</span>
                      <span>📅 {formatarData(transacao.dataCriacao)}</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: transacao.tipo === 2 ? '#10b981' : '#ef4444',
                  whiteSpace: 'nowrap',
                  marginLeft: '1rem'
                }}>
                  {transacao.tipo === 2 ? '+' : '-'} {formatarValor(transacao.valor)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
