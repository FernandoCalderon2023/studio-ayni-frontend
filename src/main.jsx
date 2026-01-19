import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Componentes principales
import App from './App';  // Tienda pública
import Dashboard from './Dashboard';  // Dashboard con métricas

// Páginas admin con botón volver
import { 
  ProductosPage, 
  PedidosPage, 
  AgendaPage, 
  EstadisticasPage 
} from './AdminPages';

// Componente de protección de rutas (opcional)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

// Componente de Login simple (si lo necesitas)
function AdminLogin() {
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Login simple (ajusta según tu backend)
    if (credentials.username === 'fernando' && credentials.password === 'admin123') {
      localStorage.setItem('token', 'dummy-token');
      window.location.href = '/admin';
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#264653' }}>
          🔐 Login Admin
        </h1>
        
        {error && (
          <div style={{
            padding: '1rem',
            background: '#FEE',
            color: '#E63946',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Usuario
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          <small>Usuario: fernando / Contraseña: admin123</small>
        </div>
      </div>
    </div>
  );
}

// Componente principal con todas las rutas
function Main() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================ */}
        {/* TIENDA PÚBLICA */}
        {/* ============================================ */}
        <Route path="/" element={<App />} />
        
        {/* ============================================ */}
        {/* ADMIN - LOGIN */}
        {/* ============================================ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* ============================================ */}
        {/* ADMIN - DASHBOARD (Protegido) */}
        {/* ============================================ */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* ============================================ */}
        {/* ADMIN - PÁGINAS CON BOTÓN VOLVER (Protegidas) */}
        {/* ============================================ */}
        <Route 
          path="/admin/productos" 
          element={
            <ProtectedRoute>
              <ProductosPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/pedidos" 
          element={
            <ProtectedRoute>
              <PedidosPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/agenda" 
          element={
            <ProtectedRoute>
              <AgendaPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/estadisticas" 
          element={
            <ProtectedRoute>
              <EstadisticasPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ============================================ */}
        {/* 404 - RUTA NO ENCONTRADA */}
        {/* ============================================ */}
        <Route 
          path="*" 
          element={
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
              <p style={{ fontSize: '1.5rem', color: '#666', margin: '1rem 0' }}>
                Página no encontrada
              </p>
              <a 
                href="/" 
                style={{
                  marginTop: '2rem',
                  padding: '1rem 2rem',
                  background: '#6B7F3C',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                Volver al inicio
              </a>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);