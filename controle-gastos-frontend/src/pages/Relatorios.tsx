import { useState, useEffect } from 'react';
import { relatoriosService } from '../services/api';
import type { RelatorioPorPessoa, RelatorioPorCategoria } from '../types/Index';

/**
 * Página de Relatórios e Consultas
 * Exibe totais por pessoa e por categoria
 */
export default function RelatoriosPage() {
  const [relatorioPessoa, setRelatorioPessoa] = useState<RelatorioPorPessoa | null>(null);
  const [relatorioCategoria, setRelatorioCategoria] = useState<RelatorioPorCategoria | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState<'pessoa' | 'categoria'>('pessoa');

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    setIsLoading(true);
    try {
      const [porPessoa, porCategoria] = await Promise.all([
        relatoriosService.porPessoa(),
        relatoriosService.porCategoria()
      ]);
      
      setRelatorioPessoa(porPessoa);
      setRelatorioCategoria(porCategoria);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      alert('Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#000' }}>Relatórios Financeiros</h2>
        <button
          onClick={carregarRelatorios}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setAbaSelecionada('pessoa')}
          style={{
            background: abaSelecionada === 'pessoa' ? '#667eea' : 'white',
            color: abaSelecionada === 'pessoa' ? 'white' : '#333',
            border: '1px solid #667eea',
            padding: '0.75rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👥 Por Pessoa
        </button>
        <button
          onClick={() => setAbaSelecionada('categoria')}
          style={{
            background: abaSelecionada === 'categoria' ? '#667eea' : 'white',
            color: abaSelecionada === 'categoria' ? 'white' : '#333',
            border: '1px solid #667eea',
            padding: '0.75rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📊 Por Categoria
        </button>
      </div>

      {/* Conteúdo da aba selecionada */}
      {abaSelecionada === 'pessoa' && relatorioPessoa && (
        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#000' }}>Totais por Pessoa</h3>
            {relatorioPessoa.totaisPorPessoa.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhuma pessoa com transações</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000' }}>Pessoa</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Receitas</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Despesas</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioPessoa.totaisPorPessoa.map((item) => (
                      <tr key={item.pessoaId} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem', color: '#000' }}>{item.pessoaNome}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#27ae60', fontWeight: '500' }}>
                          {formatarValor(item.totalReceitas)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#e74c3c', fontWeight: '500' }}>
                          {formatarValor(item.totalDespesas)}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            fontWeight: '600',
                            color: item.saldo >= 0 ? '#27ae60' : '#e74c3c'
                          }}
                        >
                          {formatarValor(item.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totais Gerais */}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '8px', color: 'white' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>💰 Totais Gerais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Receitas</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioPessoa.totaisGerais.totalReceitas)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Despesas</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioPessoa.totaisGerais.totalDespesas)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Saldo Líquido</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioPessoa.totaisGerais.saldoLiquido)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {abaSelecionada === 'categoria' && relatorioCategoria && (
        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#000' }}>Totais por Categoria</h3>
            {relatorioCategoria.totaisPorCategoria.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhuma categoria com transações</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', background: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#000' }}>Categoria</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Receitas</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Despesas</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: '#000' }}>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioCategoria.totaisPorCategoria.map((item) => (
                      <tr key={item.categoriaId} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem', color: '#000' }}>{item.categoriaNome}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#27ae60', fontWeight: '500' }}>
                          {formatarValor(item.totalReceitas)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', color: '#e74c3c', fontWeight: '500' }}>
                          {formatarValor(item.totalDespesas)}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem',
                            textAlign: 'right',
                            fontWeight: '600',
                            color: item.saldo >= 0 ? '#27ae60' : '#e74c3c'
                          }}
                        >
                          {formatarValor(item.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totais Gerais */}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '8px', color: 'white' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>💰 Totais Gerais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Receitas</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioCategoria.totaisGerais.totalReceitas)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Despesas</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioCategoria.totaisGerais.totalDespesas)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>Saldo Líquido</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                  {formatarValor(relatorioCategoria.totaisGerais.saldoLiquido)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}