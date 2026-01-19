import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Calendar, TrendingUp, ArrowLeft, DollarSign, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = 'https://studio-ayni-backend.onrender.com/api';

function Dashboard() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    pedidosNuevos: 0,
    pedidosConfirmados: 0,
    pedidosEnProceso: 0,
    pedidosRealizados: 0,
    pedidosEntregados: 0,
    totalPedidos: 0,
    visitas: 0,
    topProductos: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      // Cargar pedidos
      const resPedidos = await fetch(`${API_URL}/pedidos`);
      const pedidos = await resPedidos.json();

      // Calcular estadísticas
      const stats = {
        totalVentas: pedidos.reduce((sum, p) => sum + (p.total || 0), 0),
        pedidosNuevos: pedidos.filter(p => p.estado === 'pedido').length,
        pedidosConfirmados: pedidos.filter(p => p.estado === 'confirmado').length,
        pedidosEnProceso: pedidos.filter(p => p.estado === 'en_proceso').length,
        pedidosRealizados: pedidos.filter(p => p.estado === 'realizado').length,
        pedidosEntregados: pedidos.filter(p => p.estado === 'entregado').length,
        totalPedidos: pedidos.length,
        visitas: Math.floor(Math.random() * 2000) + 500, // Simulado - implementar analytics real
        topProductos: calcularTopProductos(pedidos)
      };

      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTopProductos = (pedidos) => {
    const conteo = {};
    
    pedidos.forEach(pedido => {
      if (pedido.productos) {
        pedido.productos.forEach(prod => {
          const nombre = prod.nombre || 'Sin nombre';
          if (!conteo[nombre]) {
            conteo[nombre] = 0;
          }
          conteo[nombre] += prod.cantidad || 1;
        });
      }
    });

    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const cards = [
    { 
      id: 'productos', 
      titulo: 'Productos', 
      icon: Package, 
      color: '#6B7F3C',
      descripcion: 'Gestionar catálogo',
      ruta: '/admin/productos'
    },
    { 
      id: 'pedidos', 
      titulo: 'Pedidos', 
      icon: ShoppingCart, 
      color: '#2A9D8F',
      descripcion: 'Gestionar órdenes',
      ruta: '/admin/pedidos',
      badge: estadisticas.pedidosNuevos
    },
    { 
      id: 'agenda', 
      titulo: 'Agenda', 
      icon: Calendar, 
      color: '#F4A261',
      descripcion: 'Entregas programadas',
      ruta: '/admin/agenda'
    },
    { 
      id: 'estadisticas', 
      titulo: 'Estadísticas', 
      icon: TrendingUp, 
      color: '#E76F51',
      descripcion: 'Análisis y reportes',
      ruta: '/admin/estadisticas'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

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
            <a href="/" className="btn-tienda">
              🏠 Ir a Tienda
            </a>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
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
              <p className="metrica-valor">Bs {estadisticas.totalVentas.toFixed(2)}</p>
              <span className="metrica-sub">Acumulado total</span>
            </div>
          </div>

          <div className="metrica-card" style={{ borderLeft: '4px solid #2A9D8F' }}>
            <div className="metrica-icon" style={{ background: 'rgba(42, 157, 143, 0.1)' }}>
              <ShoppingCart size={28} color="#2A9D8F" />
            </div>
            <div className="metrica-info">
              <h3>Pedidos Totales</h3>
              <p className="metrica-valor">{estadisticas.totalPedidos}</p>
              <span className="metrica-sub">{estadisticas.pedidosNuevos} nuevos</span>
            </div>
          </div>

          <div className="metrica-card" style={{ borderLeft: '4px solid #F4A261' }}>
            <div className="metrica-icon" style={{ background: 'rgba(244, 162, 97, 0.1)' }}>
              <Eye size={28} color="#F4A261" />
            </div>
            <div className="metrica-info">
              <h3>Visitas</h3>
              <p className="metrica-valor">{estadisticas.visitas}</p>
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
                {((estadisticas.totalPedidos / estadisticas.visitas) * 100).toFixed(1)}%
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
              <span className="estado-numero">{estadisticas.pedidosNuevos}</span>
              <span className="estado-label">Nuevos</span>
            </div>
            <div className="estado-card confirmados">
              <span className="estado-numero">{estadisticas.pedidosConfirmados}</span>
              <span className="estado-label">Confirmados</span>
            </div>
            <div className="estado-card proceso">
              <span className="estado-numero">{estadisticas.pedidosEnProceso}</span>
              <span className="estado-label">En Proceso</span>
            </div>
            <div className="estado-card realizados">
              <span className="estado-numero">{estadisticas.pedidosRealizados}</span>
              <span className="estado-label">Realizados</span>
            </div>
            <div className="estado-card entregados">
              <span className="estado-numero">{estadisticas.pedidosEntregados}</span>
              <span className="estado-label">Entregados</span>
            </div>
          </div>
        </div>

        {/* Navegación a secciones */}
        <div className="seccion">
          <h2>🚀 Accesos Rápidos</h2>
          <div className="cards-grid">
            {cards.map(card => {
              const Icon = card.icon;
              return (
                <div 
                  key={card.id}
                  className="nav-card"
                  onClick={() => navigate(card.ruta)}
                  style={{ borderTop: `4px solid ${card.color}` }}
                >
                  {card.badge > 0 && (
                    <div className="card-badge">{card.badge}</div>
                  )}
                  <div className="card-icon" style={{ background: `${card.color}15` }}>
                    <Icon size={40} color={card.color} />
                  </div>
                  <h3>{card.titulo}</h3>
                  <p>{card.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top productos */}
        <div className="seccion">
          <h2>🏆 Top 3 Más Vendidos</h2>
          <div className="top-productos">
            {estadisticas.topProductos.length > 0 ? (
              estadisticas.topProductos.map((prod, index) => (
                <div key={index} className="top-producto-item">
                  <div className="top-numero">{index + 1}</div>
                  <div className="top-info">
                    <h4>{prod.nombre}</h4>
                    <p>{prod.cantidad} unidades vendidas</p>
                  </div>
                  <div className="top-badge">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
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