import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transacoesService, pessoasService, categoriasService, relatoriosService } from '../services/api';
import type { Transacao } from '../types/Index';

export default function Dashboard() {
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([]);
  const [totaisPessoas, setTotaisPessoas] = useState(0);
  const [totaisCategorias, setTotaisCategorias] = useState(0);
  const [totaisTransacoes, setTotaisTransacoes] = useState(0);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [saldoLiquido, setSaldoLiquido] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [transacoes, pessoas, categorias, relatorio] = await Promise.all([
        transacoesService.listar(),
        pessoasService.listar(),
        categoriasService.listar(),
        relatoriosService.porPessoa()
      ]);

      setTransacoesRecentes(transacoes.slice(0, 5));
      setTotaisPessoas(pessoas.length);
      setTotaisCategorias(categorias.length);
      setTotaisTransacoes(transacoes.length);
      setTotalReceitas(relatorio.totaisGerais.totalReceitas);
      setTotalDespesas(relatorio.totaisGerais.totalDespesas);
      setSaldoLiquido(relatorio.totaisGerais.saldoLiquido);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Dashboard
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>Visão geral das suas finanças</p>
      </div>

      {/* Cards Financeiros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        {/* Card Receitas */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.75rem',
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
            height: '4px',
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>💰</span>
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#065f46'
            }}>
              RECEITAS
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.25rem' }}>
            {formatarValor(totalReceitas)}
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Total de entradas</p>
        </div>

        {/* Card Despesas */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.75rem',
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
            height: '4px',
            background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>💸</span>
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#991b1b'
            }}>
              DESPESAS
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.25rem' }}>
            {formatarValor(totalDespesas)}
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Total de saídas</p>
        </div>

        {/* Card Saldo */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.75rem',
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
            height: '4px',
            background: saldoLiquido >= 0 
              ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
              : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{saldoLiquido >= 0 ? '📊' : '⚠️'}</span>
            <div style={{
              background: saldoLiquido >= 0 
                ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                : 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: saldoLiquido >= 0 ? '#1e40af' : '#92400e'
            }}>
              SALDO
            </div>
          </div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: saldoLiquido >= 0 ? '#3b82f6' : '#f59e0b',
            marginBottom: '0.25rem' 
          }}>
            {formatarValor(saldoLiquido)}
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Saldo líquido</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        <Link to="/pessoas" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👥</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{totaisPessoas}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Pessoas</div>
          </div>
        </Link>

        <Link to="/categorias" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 147, 251, 0.4)';
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏷️</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{totaisCategorias}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Categorias</div>
          </div>
        </Link>

        <Link to="/transacoes" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 172, 254, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.4)';
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{totaisTransacoes}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Transações</div>
          </div>
        </Link>
      </div>

      {/* Transações Recentes */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>
            Transações Recentes
          </h3>
          <Link 
            to="/transacoes" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            Ver todas →
          </Link>
        </div>

        {transacoesRecentes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ margin: 0 }}>Nenhuma transação registrada ainda</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transacoesRecentes.map((transacao) => (
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
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                      <span>👤 {transacao.pessoaNome}</span>
                      <span>🏷️ {transacao.categoriaNome}</span>
                      <span>📅 {formatarData(transacao.dataCriacao)}</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: transacao.tipo === 2 ? '#10b981' : '#ef4444'
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
