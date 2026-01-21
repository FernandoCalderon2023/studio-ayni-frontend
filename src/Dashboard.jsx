import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Calendar, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    totalVentas: 0,
    nuevos: 0,
    confirmados: 0,
    enProceso: 0,
    realizados: 0,
    entregados: 0,
    total: 0,
    visitas: 847,
    topProductos: []
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    console.log('=== DASHBOARD INICIANDO ===');
    
    try {
      // URL del backend
      const url = 'https://studio-ayni-backend.onrender.com/api/pedidos';
      
      // INTENTO 1: Sin token
      console.log('Intento 1: Cargando sin token...');
      let respuesta = await fetch(url);
      console.log('Status:', respuesta.status);
      
      // Si da 401, intentar con token
      if (respuesta.status === 401) {
        console.log('Intento 2: Cargando con token...');
        const token = localStorage.getItem('token');
        
        if (token) {
          respuesta = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('Status con token:', respuesta.status);
        } else {
          console.log('No hay token en localStorage');
        }
      }
      
      // Verificar respuesta
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}`);
      }
      
      // Obtener pedidos
      const pedidos = await respuesta.json();
      console.log('✅ Pedidos cargados:', pedidos.length);
      
      // Verificar que sea array
      if (!Array.isArray(pedidos)) {
        throw new Error('Respuesta no es un array');
      }
      
      // Calcular totales
      const totalVentas = pedidos.reduce((suma, p) => suma + (Number(p.total) || 0), 0);
      
      // Contar por estado
      const nuevos = pedidos.filter(p => ['pedido', 'nuevo', 'pendiente'].includes(p.estado)).length;
      const confirmados = pedidos.filter(p => p.estado === 'confirmado').length;
      const enProceso = pedidos.filter(p => ['en_proceso', 'proceso'].includes(p.estado)).length;
      const realizados = pedidos.filter(p => ['realizado', 'completado'].includes(p.estado)).length;
      const entregados = pedidos.filter(p => ['entregado', 'entregados'].includes(p.estado)).length;
      
      // Top productos
      const conteo = {};
      pedidos.forEach(pedido => {
        const prods = pedido.productos || [];
        prods.forEach(p => {
          const nombre = p.nombre || 'Sin nombre';
          conteo[nombre] = (conteo[nombre] || 0) + (Number(p.cantidad) || 1);
        });
      });
      
      const topProductos = Object.entries(conteo)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 3);
      
      // Guardar datos
      setDatos({
        totalVentas,
        nuevos,
        confirmados,
        enProceso,
        realizados,
        entregados,
        total: pedidos.length,
        visitas: 847,
        topProductos
      });
      
      console.log('✅ Datos procesados:', {
        total: pedidos.length,
        entregados,
        totalVentas
      });
      
    } catch (err) {
      console.error('❌ Error:', err.message);
      setError(err.message);
    }
    
    setCargando(false);
  }

  const salir = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Pantalla de carga
  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E0E0E0',
          borderTopColor: '#6B7F3C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Cargando dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#E63946', fontSize: '2rem' }}>⚠️ Error</h2>
        <p style={{ color: '#666', maxWidth: '500px' }}>{error}</p>
        <button onClick={cargarDatos} style={{
          padding: '1rem 2rem',
          background: '#6B7F3C',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="logo-section">
            <div className="logo-circle">SA</div>
            <div className="logo-text">
              <span className="logo-studio">STUDIO</span>
              <span className="logo-ayni">AYNI</span>
            </div>
          </div>
          <div className="header-actions">
            <a href="/" className="btn-tienda">🏠 Ir a Tienda</a>
            <button onClick={salir} className="btn-logout">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Título */}
        <div className="dashboard-title">
          <h1>📊 Panel de Administración</h1>
          <p>Bienvenido al centro de control de Studio AYNI</p>
        </div>

        {/* Métricas principales */}
        <div className="metricas-grid">
          <div className="metrica-card" style={{ borderLeft: '4px solid #6B7F3C' }}>
            <div className="metrica-icon" style={{ background: 'rgba(107, 127, 60, 0.1)' }}>
              <DollarSign size={28} color="#6B7F3C" />
            </div>
            <div className="metrica-info">
              <h3>Total Ventas</h3>
              <p className="metrica-valor">Bs {datos.totalVentas.toFixed(2)}</p>
              <span className="metrica-sub">Acumulado total</span>
            </div>
          </div>

          <div className="metrica-card" style={{ borderLeft: '4px solid #2A9D8F' }}>
            <div className="metrica-icon" style={{ background: 'rgba(42, 157, 143, 0.1)' }}>
              <ShoppingCart size={28} color="#2A9D8F" />
            </div>
            <div className="metrica-info">
              <h3>Pedidos Totales</h3>
              <p className="metrica-valor">{datos.total}</p>
              <span className="metrica-sub">{datos.nuevos} nuevos</span>
            </div>
          </div>

          <div className="metrica-card" style={{ borderLeft: '4px solid #F4A261' }}>
            <div className="metrica-icon" style={{ background: 'rgba(244, 162, 97, 0.1)' }}>
              <Eye size={28} color="#F4A261" />
            </div>
            <div className="metrica-info">
              <h3>Visitas</h3>
              <p className="metrica-valor">{datos.visitas}</p>
              <span className="metrica-sub">Este mes</span>
            </div>
          </div>

          <div className="metrica-card" style={{ borderLeft: '4px solid #E76F51' }}>
            <div className="metrica-icon" style={{ background: 'rgba(231, 111, 81, 0.1)' }}>
              <TrendingUp size={28} color="#E76F51" />
            </div>
            <div className="metrica-info">
              <h3>Tasa Conversión</h3>
              <p className="metrica-valor">
                {datos.total > 0 ? ((datos.total / datos.visitas) * 100).toFixed(1) : '0.0'}%
              </p>
              <span className="metrica-sub">Visitas → Pedidos</span>
            </div>
          </div>
        </div>

        {/* Estado de pedidos */}
        <div className="seccion">
          <h2>📦 Estado de Pedidos</h2>
          <div className="estados-grid">
            <div className="estado-card nuevos">
              <span className="estado-numero">{datos.nuevos}</span>
              <span className="estado-label">Nuevos</span>
            </div>
            <div className="estado-card confirmados">
              <span className="estado-numero">{datos.confirmados}</span>
              <span className="estado-label">Confirmados</span>
            </div>
            <div className="estado-card proceso">
              <span className="estado-numero">{datos.enProceso}</span>
              <span className="estado-label">En Proceso</span>
            </div>
            <div className="estado-card realizados">
              <span className="estado-numero">{datos.realizados}</span>
              <span className="estado-label">Realizados</span>
            </div>
            <div className="estado-card entregados">
              <span className="estado-numero">{datos.entregados}</span>
              <span className="estado-label">Entregados</span>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="seccion">
          <h2>🚀 Accesos Rápidos</h2>
          <div className="cards-grid">
            <div className="nav-card" onClick={() => navigate('/admin/productos')} style={{ borderTop: '4px solid #6B7F3C' }}>
              <div className="card-icon" style={{ background: 'rgba(107, 127, 60, 0.1)' }}>
                <Package size={40} color="#6B7F3C" />
              </div>
              <h3>Productos</h3>
              <p>Gestionar catálogo</p>
            </div>

            <div className="nav-card" onClick={() => navigate('/admin/pedidos')} style={{ borderTop: '4px solid #2A9D8F' }}>
              {datos.nuevos > 0 && <div className="card-badge">{datos.nuevos}</div>}
              <div className="card-icon" style={{ background: 'rgba(42, 157, 143, 0.1)' }}>
                <ShoppingCart size={40} color="#2A9D8F" />
              </div>
              <h3>Pedidos</h3>
              <p>Gestionar órdenes</p>
            </div>

            <div className="nav-card" onClick={() => navigate('/admin/agenda')} style={{ borderTop: '4px solid #F4A261' }}>
              <div className="card-icon" style={{ background: 'rgba(244, 162, 97, 0.1)' }}>
                <Calendar size={40} color="#F4A261" />
              </div>
              <h3>Agenda</h3>
              <p>Entregas programadas</p>
            </div>

            <div className="nav-card" onClick={() => navigate('/admin/estadisticas')} style={{ borderTop: '4px solid #E76F51' }}>
              <div className="card-icon" style={{ background: 'rgba(231, 111, 81, 0.1)' }}>
                <TrendingUp size={40} color="#E76F51" />
              </div>
              <h3>Estadísticas</h3>
              <p>Análisis y reportes</p>
            </div>
          </div>
        </div>

        {/* Top productos */}
        <div className="seccion">
          <h2>🏆 Top 3 Más Vendidos</h2>
          <div className="top-productos">
            {datos.topProductos.length > 0 ? (
              datos.topProductos.map((prod, i) => (
                <div key={i} className="top-producto-item">
                  <div className="top-numero">{i + 1}</div>
                  <div className="top-info">
                    <h4>{prod.nombre}</h4>
                    <p>{prod.cantidad} unidades vendidas</p>
                  </div>
                  <div className="top-badge">
                    {i === 0 && '🥇'}
                    {i === 1 && '🥈'}
                    {i === 2 && '🥉'}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No hay datos de ventas aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;