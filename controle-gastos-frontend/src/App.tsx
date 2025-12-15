import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Pessoas from './pages/Pessoas';
import Categorias from './pages/Categorias';
import Transacoes from './pages/Transacoes';
import RelatoriosPage from './pages/Relatorios';
import type { JSX } from 'react';

// Componente de rota protegida
// Só permite acesso se o usuário estiver autenticado
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Layout principal com navegação
function Layout({ children }: { children: JSX.Element }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header/Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>💰 Controle de Gastos</h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/pessoas" style={{ color: 'white', textDecoration: 'none' }}>Pessoas</Link>
          <Link to="/categorias" style={{ color: 'white', textDecoration: 'none' }}>Categorias</Link>
          <Link to="/transacoes" style={{ color: 'white', textDecoration: 'none' }}>Transações</Link>
          <Link to="/relatorios" style={{ color: 'white', textDecoration: 'none' }}>Relatórios</Link>
          
          <span style={{ marginLeft: '1rem' }}>👤 {user?.nome}</span>
          <button
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo */}
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}

// Componente principal da aplicação
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pessoas"
            element={
              <PrivateRoute>
                <Layout>
                  <Pessoas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <PrivateRoute>
                <Layout>
                  <Categorias />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/transacoes"
            element={
              <PrivateRoute>
                <Layout>
                  <Transacoes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Layout>
                  <RelatoriosPage />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;