/**
 * Tipos TypeScript para o frontend
 * Devem corresponder aos DTOs do backend
 */

// ===== AUTENTICAÇÃO =====
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
}

// ===== PESSOA =====
export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  ehMenorDeIdade: boolean;
}

export interface CriarPessoaRequest {
  nome: string;
  idade: number;
}

// ===== CATEGORIA =====
export const FinalidadeCategoria = {
  Despesa: 1,
  Receita: 2,
  Ambas: 3
} as const;

export type FinalidadeCategoria = typeof FinalidadeCategoria[keyof typeof FinalidadeCategoria];

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: FinalidadeCategoria;
  finalidadeTexto: string;
}

export interface CriarCategoriaRequest {
  descricao: string;
  finalidade: FinalidadeCategoria;
}

// ===== TRANSAÇÃO =====
export const TipoTransacao = {
  Despesa: 1,
  Receita: 2
} as const;

export type TipoTransacao = typeof TipoTransacao[keyof typeof TipoTransacao];

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  tipoTexto: string;
  categoriaId: number;
  categoriaNome: string;
  pessoaId: number;
  pessoaNome: string;
  dataCriacao: string;
}

export interface CriarTransacaoRequest {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: number;
  pessoaId: number;
}

// ===== RELATÓRIOS =====
export interface TotalPorPessoa {
  pessoaId: number;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalPorCategoria {
  categoriaId: number;
  categoriaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGerais {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface RelatorioPorPessoa {
  totaisPorPessoa: TotalPorPessoa[];
  totaisGerais: TotaisGerais;
}

export interface RelatorioPorCategoria {
  totaisPorCategoria: TotalPorCategoria[];
  totaisGerais: TotaisGerais;
}