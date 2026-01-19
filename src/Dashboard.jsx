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
      console.log('📊 Cargando estadísticas...');
      
      // Cargar pedidos SIN autenticación
      const resPedidos = await fetch(`${API_URL}/pedidos`);
      
      console.log('Response status:', resPedidos.status);
      
      if (!resPedidos.ok) {
        console.error('❌ Error al cargar pedidos:', resPedidos.status);
        
        if (resPedidos.status === 401) {
          console.error('⚠️ El backend requiere autenticación');
          console.error('💡 Solución: Hacer el endpoint público o configurar token válido');
        }
        
        setLoading(false);
        return;
      }
      
      const pedidos = await resPedidos.json();
      console.log('✅ Pedidos cargados:', pedidos);
      console.log('📦 Total pedidos:', pedidos.length);

      if (!Array.isArray(pedidos)) {
        console.error('❌ Pedidos no es un array:', pedidos);
        setEstadisticas({
          totalVentas: 0,
          pedidosNuevos: 0,
          pedidosConfirmados: 0,
          pedidosEnProceso: 0,
          pedidosRealizados: 0,
          pedidosEntregados: 0,
          totalPedidos: 0,
          visitas: 847,
          topProductos: []
        });
        setLoading(false);
        return;
      }

      // Mostrar estados de los pedidos
      console.log('📊 Estados encontrados:');
      pedidos.forEach(p => console.log(`  - Estado: "${p.estado}", Total: ${p.total}`));

      // Calcular estadísticas
      const totalVentas = pedidos.reduce((sum, p) => {
        const total = parseFloat(p.total) || 0;
        return sum + total;
      }, 0);

      const pedidosNuevos = pedidos.filter(p => 
        p.estado === 'pedido' || p.estado === 'nuevo' || p.estado === 'pendiente'
      ).length;

      const pedidosConfirmados = pedidos.filter(p => 
        p.estado === 'confirmado'
      ).length;

      const pedidosEnProceso = pedidos.filter(p => 
        p.estado === 'en_proceso' || p.estado === 'proceso'
      ).length;

      const pedidosRealizados = pedidos.filter(p => 
        p.estado === 'realizado' || p.estado === 'completado'
      ).length;

      const pedidosEntregados = pedidos.filter(p => 
        p.estado === 'entregado' || p.estado === 'entregados'
      ).length;

      console.log('📊 Conteo por estado:');
      console.log(`  Nuevos: ${pedidosNuevos}`);
      console.log(`  Confirmados: ${pedidosConfirmados}`);
      console.log(`  En Proceso: ${pedidosEnProceso}`);
      console.log(`  Realizados: ${pedidosRealizados}`);
      console.log(`  Entregados: ${pedidosEntregados}`);

      const visitas = 847;
      const tasaConversion = pedidos.length > 0 ? (pedidos.length / visitas) * 100 : 0;

      const stats = {
        totalVentas: totalVentas,
        pedidosNuevos: pedidosNuevos,
        pedidosConfirmados: pedidosConfirmados,
        pedidosEnProceso: pedidosEnProceso,
        pedidosRealizados: pedidosRealizados,
        pedidosEntregados: pedidosEntregados,
        totalPedidos: pedidos.length,
        visitas: visitas,
        tasaConversion: tasaConversion,
        topProductos: calcularTopProductos(pedidos)
      };

      console.log('✅ Estadísticas calculadas:', stats);
      setEstadisticas(stats);

    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      setEstadisticas({
        totalVentas: 0,
        pedidosNuevos: 0,
        pedidosConfirmados: 0,
        pedidosEnProceso: 0,
        pedidosRealizados: 0,
        pedidosEntregados: 0,
        totalPedidos: 0,
        visitas: 847,
        topProductos: []
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularTopProductos = (pedidos) => {
    const conteo = {};
    
    pedidos.forEach(pedido => {
      // Manejar diferentes estructuras de datos
      let productos = [];
      
      if (Array.isArray(pedido.productos)) {
        productos = pedido.productos;
      } else if (Array.isArray(pedido.items)) {
        productos = pedido.items;
      } else if (pedido.producto) {
        productos = [pedido.producto];
      }

      productos.forEach(prod => {
        // Obtener nombre del producto
        const nombre = prod.nombre || prod.name || prod.producto || 'Sin nombre';
        
        if (!conteo[nombre]) {
          conteo[nombre] = 0;
        }
        
        // Obtener cantidad
        const cantidad = parseInt(prod.cantidad) || parseInt(prod.qty) || 1;
        conteo[nombre] += cantidad;
      });
    });

    // Convertir a array y ordenar
    const topProductos = Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);

    console.log('Top productos:', topProductos);
    return topProductos;
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
                {estadisticas.totalPedidos > 0 && estadisticas.visitas > 0
                  ? ((estadisticas.totalPedidos / estadisticas.visitas) * 100).toFixed(1)
                  : '0.0'}%
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