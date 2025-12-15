import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';
import type { User, LoginRequest, RegistroRequest } from '../types/Index';


//Interface do contexto de autenticação
interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  registro: (data: RegistroRequest) => Promise<void>;
  logout: () => void;
}

//Contexto de autenticação
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

//Provider de autenticação
// Gerencia o estado do usuário logado e token JWT
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao carregar o componente, verifica se há usuário salvo no localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Função de login
  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);

      // Salvar token e usuário no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        nome: response.nome,
        email: response.email
      }));

      // Atualizar estado
      setUser({
        id: response.id,
        nome: response.nome,
        email: response.email
      });
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de registro
  const registro = async (data: RegistroRequest) => {
    try {
      const response = await authService.registro(data);

      // Salvar token e usuário no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        nome: response.nome,
        email: response.email
      }));

      // Atualizar estado
      setUser({
        id: response.id,
        nome: response.nome,
        email: response.email
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    registro,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}