import axios from 'axios';
import type {
  LoginRequest,
  RegistroRequest,
  AuthResponse,
  Pessoa,
  CriarPessoaRequest,
  Categoria,
  CriarCategoriaRequest,
  Transacao,
  CriarTransacaoRequest,
  RelatorioPorPessoa,
  RelatorioPorCategoria
} from '../types/Index';

// URL base da API - altere para a porta correta da sua API
const API_URL = 'http://localhost:5013/api';

//Instância do Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT em todas as requisições
// O token é pego do localStorage automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
// Se receber 401 (Unauthorized), redireciona para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== SERVIÇO DE AUTENTICAÇÃO =====
export const authService = {
  // Faz login do usuário
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Registra um novo usuário
  async registro(data: RegistroRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/registro', data);
    return response.data;
  }
};

// ===== SERVIÇO DE PESSOAS =====
export const pessoasService = {
  // Lista todas as pessoas
  async listar(): Promise<Pessoa[]> {
    const response = await api.get<Pessoa[]>('/pessoas');
    return response.data;
  },

  // Busca uma pessoa por ID
  async buscar(id: number): Promise<Pessoa> {
    const response = await api.get<Pessoa>(`/pessoas/${id}`);
    return response.data;
  },

  // Cria uma nova pessoa
  async criar(data: CriarPessoaRequest): Promise<Pessoa> {
    const response = await api.post<Pessoa>('/pessoas', data);
    return response.data;
  },

  // Deleta uma pessoa (e todas suas transações)
  async deletar(id: number): Promise<void> {
    await api.delete(`/pessoas/${id}`);
  }
};

// ===== SERVIÇO DE CATEGORIAS =====
export const categoriasService = {
  // Lista todas as categorias
  async listar(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/categorias');
    return response.data;
  },

  // Busca uma categoria por ID
  async buscar(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  // Cria uma nova categoria
  async criar(data: CriarCategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>('/categorias', data);
    return response.data;
  }
};

// ===== SERVIÇO DE TRANSAÇÕES =====
export const transacoesService = {
  // Lista todas as transações
  async listar(): Promise<Transacao[]> {
    const response = await api.get<Transacao[]>('/transacoes');
    return response.data;
  },

  // Busca uma transação por ID
  async buscar(id: number): Promise<Transacao> {
    const response = await api.get<Transacao>(`/transacoes/${id}`);
    return response.data;
  },

  // Cria uma nova transação
  async criar(data: CriarTransacaoRequest): Promise<Transacao> {
    const response = await api.post<Transacao>('/transacoes', data);
    return response.data;
  }
};

// ===== SERVIÇO DE RELATÓRIOS =====
export const relatoriosService = {
  // Busca relatório de totais por pessoa
  async porPessoa(): Promise<RelatorioPorPessoa> {
    const response = await api.get<RelatorioPorPessoa>('/relatorios/por-pessoa');
    return response.data;
  },

  // Busca relatório de totais por categoria
  async porCategoria(): Promise<RelatorioPorCategoria> {
    const response = await api.get<RelatorioPorCategoria>('/relatorios/por-categoria');
    return response.data;
  }
};

export default api;