import { useState } from 'react';
import { Package, ShoppingCart, Calendar, Menu, X, Home, LogOut } from 'lucide-react';
import './AdminLayout.css';

// IMPORTAR TUS COMPONENTES EXISTENTES:
import Admin from './Admin';  // Tu gestión de productos actual
import Pedidos from './Pedidos-DRAG-DROP';  // Tu componente con drag & drop
import AgendaEntregas from './AgendaEntregas';  // Tu calendario

function AdminLayout() {
  const [vistaActual, setVistaActual] = useState('productos');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'productos', nombre: 'Productos', icon: Package, color: '#6B7F3C' },
    { id: 'pedidos', nombre: 'Pedidos', icon: ShoppingCart, color: '#2A9D8F' },
    { id: 'agenda', nombre: 'Agenda', icon: Calendar, color: '#F4A261' }
  ];

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-circle">SA</div>
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-studio">STUDIO</span>
                <span className="logo-ayni">AYNI</span>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = vistaActual === item.id;
            
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setVistaActual(item.id)}
                style={isActive ? { borderLeftColor: item.color } : {}}
              >
                <Icon size={22} style={{ color: isActive ? item.color : '#666' }} />
                {sidebarOpen && <span>{item.nombre}</span>}
                {!sidebarOpen && (
                  <div className="sidebar-tooltip">{item.nombre}</div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="sidebar-item">
            <Home size={22} />
            {sidebarOpen && <span>Ir a Tienda</span>}
          </a>
          
          <button className="sidebar-item logout" onClick={handleLogout}>
            <LogOut size={22} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <div className="admin-content">
          {/* RENDERIZAR TUS COMPONENTES EXISTENTES */}
          {vistaActual === 'productos' && <Admin />}
          {vistaActual === 'pedidos' && <Pedidos />}
          {vistaActual === 'agenda' && <AgendaEntregas />}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;