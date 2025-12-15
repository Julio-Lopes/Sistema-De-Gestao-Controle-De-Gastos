import { useState, useEffect } from 'react';
import { pessoasService } from '../services/api';
import type { Pessoa, CriarPessoaRequest } from '../types/Index';

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const data = await pessoasService.listar();
      setPessoas(data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      mostrarMensagem('erro', 'Erro ao carregar pessoas');
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
      const request: CriarPessoaRequest = {
        nome,
        idade: parseInt(idade)
      };
      
      await pessoasService.criar(request);
      setNome('');
      setIdade('');
      carregarPessoas();
      mostrarMensagem('sucesso', 'Pessoa cadastrada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar pessoa:', error);
      mostrarMensagem('erro', error.response?.data?.message || 'Erro ao criar pessoa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${nome}? Todas as transações desta pessoa também serão deletadas.`)) {
      return;
    }

    try {
      await pessoasService.deletar(id);
      carregarPessoas();
      mostrarMensagem('sucesso', 'Pessoa deletada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar pessoa:', error);
      mostrarMensagem('erro', error.response?.data?.message || 'Erro ao deletar pessoa');
    }
  };

  const getIdadeColor = (ehMenor: boolean) => {
    return ehMenor ? '#f59e0b' : '#10b981';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Gerenciar Pessoas
        </h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>Cadastre e gerencie as pessoas do sistema</p>
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
          Nova Pessoa
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                maxLength={100}
                placeholder="Digite o nome completo"
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
                Idade
              </label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                required
                min={0}
                max={150}
                placeholder="Ex: 25"
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
            {isLoading ? '⏳ Cadastrando...' : '➕ Cadastrar Pessoa'}
          </button>
        </form>
      </div>

      {/* Lista de Pessoas */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1.5rem' }}>
          Pessoas Cadastradas ({pessoas.length})
        </h3>

        {pessoas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nenhuma pessoa cadastrada</p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Cadastre a primeira pessoa usando o formulário acima</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {pessoas.map((pessoa) => (
              <div
                key={pessoa.id}
                style={{
                  background: '#fafafa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${getIdadeColor(pessoa.ehMenorDeIdade)} 0%, ${getIdadeColor(pessoa.ehMenorDeIdade)}aa 100%)`
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${getIdadeColor(pessoa.ehMenorDeIdade)}22 0%, ${getIdadeColor(pessoa.ehMenorDeIdade)}44 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    {pessoa.ehMenorDeIdade ? '👶' : '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                      {pessoa.nome}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: `${getIdadeColor(pessoa.ehMenorDeIdade)}22`,
                        color: getIdadeColor(pessoa.ehMenorDeIdade),
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {pessoa.idade} anos
                      </span>
                      {pessoa.ehMenorDeIdade && (
                        <span style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          Menor
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeletar(pessoa.id, pessoa.nome)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#991b1b',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                  }}
                >
                  🗑️ Deletar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informação sobre regras */}
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
              Regras Importantes
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e3a8a' }}>
              <li>Menores de 18 anos são identificados automaticamente</li>
              <li>Menores de idade não podem ter receitas (apenas despesas)</li>
              <li>Ao deletar uma pessoa, todas suas transações também serão deletadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
