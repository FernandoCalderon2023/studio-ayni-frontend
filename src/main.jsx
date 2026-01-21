import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import App from './App';
import Dashboard from './Dashboard';
import { ProductosPage, PedidosPage, AgendaPage, EstadisticasPage } from './AdminPages';

// Componente de protección de rutas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

// Login con backend real
function AdminLogin() {
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: ''
  });
  const [error, setError] = React.useState('');
  const [cargando, setCargando] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      console.log('🔐 Intentando login...');
      
      // Llamar al backend real
      const response = await fetch('https://studio-ayni-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      console.log('📡 Status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else {
          setError(`Error del servidor: ${response.status}`);
        }
        setCargando(false);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Respuesta del backend:', data);
      
      // Verificar que el backend retornó un token
      if (data.token) {
        console.log('✅ Token recibido, guardando...');
        localStorage.setItem('token', data.token);
        window.location.href = '/admin';
      } else if (data.access_token) {
        // Por si el backend usa "access_token" en vez de "token"
        console.log('✅ Access token recibido, guardando...');
        localStorage.setItem('token', data.access_token);
        window.location.href = '/admin';
      } else {
        console.error('❌ Backend no retornó token:', data);
        setError('Error: El servidor no retornó un token válido');
        setCargando(false);
      }
      
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      setError('Error de conexión: ' + err.message);
      setCargando(false);
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
                fontSize: '1rem',
                boxSizing: 'border-box'
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
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '1rem',
              background: cargando ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? '⏳ Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          <small>Usuario: fernando / Contraseña: admin123</small>
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
          <small>Conectando con backend en Render...</small>
        </div>
      </div>
    </div>
  );
}

// Componente principal
function Main() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tienda pública */}
        <Route path="/" element={<App />} />
        
        {/* Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Dashboard (protegido) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Páginas admin (protegidas) */}
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
        
        {/* 404 */}
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

// Renderizar
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);