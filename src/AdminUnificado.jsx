import { useState, useEffect } from 'react';
import { LogOut, Package, ShoppingCart, Calendar, Menu, X, Home } from 'lucide-react';
import './AdminUnificado.css';

const API_URL = 'https://studio-ayni-backend.onrender.com/api';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_CLOUD_NAME = 'dhlqwu0oe';

function AdminUnificado() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [vistaActual, setVistaActual] = useState('productos'); // productos, pedidos, agenda
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    if (!token) {
      window.location.href = '/admin';
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'productos', nombre: 'Productos', icon: Package, color: '#6B7F3C' },
    { id: 'pedidos', nombre: 'Pedidos', icon: ShoppingCart, color: '#2A9D8F' },
    { id: 'agenda', nombre: 'Agenda', icon: Calendar, color: '#F4A261' }
  ];

  return (
    <div className="admin-unificado">
      {/* Sidebar */}
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
            title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
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
          <a 
            href="/"
            className="sidebar-item"
            title="Ir a tienda"
          >
            <Home size={22} />
            {sidebarOpen && <span>Ir a Tienda</span>}
          </a>
          
          <button
            className="sidebar-item logout"
            onClick={handleLogout}
          >
            <LogOut size={22} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {vistaActual === 'productos' && <SeccionProductos token={token} />}
          {vistaActual === 'pedidos' && <SeccionPedidos token={token} />}
          {vistaActual === 'agenda' && <SeccionAgenda token={token} />}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// ============================================
// SECCIÓN PRODUCTOS
// ============================================
function SeccionProductos({ token }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria: '',
    colores: []
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      setFormData(prev => ({ ...prev, imagen: data.secure_url }));
      setSuccess('✅ Imagen subida');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Error al subir imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editando 
        ? `${API_URL}/productos/${editando.id}`
        : `${API_URL}/productos`;
      
      const response = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          precio: parseFloat(formData.precio)
        })
      });

      if (response.ok) {
        setSuccess(editando ? '✅ Producto actualizado' : '✅ Producto creado');
        cerrarModal();
        cargarProductos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;

    try {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('✅ Producto eliminado');
        cargarProductos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const abrirModalEditar = (producto) => {
    setEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria || '',
      colores: producto.colores || []
    });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      categoria: '',
      colores: []
    });
  };

  return (
    <div className="seccion-productos">
      <div className="seccion-header">
        <div>
          <h1>📦 Gestión de Productos</h1>
          <p>{productos.length} productos en catálogo</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Package size={20} />
          Agregar Producto
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id} className="producto-card-admin">
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="producto-precio">Bs {producto.precio}</p>
              <p className="producto-desc">{producto.descripcion}</p>
              {producto.colores && producto.colores.length > 0 && (
                <div className="producto-colores">
                  {producto.colores.map((color, i) => {
                    // Manejar tanto strings como objetos
                    const nombreColor = typeof color === 'string' 
                      ? color 
                      : color.nombre || color.hex || 'Color';
                    
                    return (
                      <span key={i} className="color-tag">{nombreColor}</span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="producto-actions">
              <button onClick={() => abrirModalEditar(producto)} className="btn-edit">
                Editar
              </button>
              <button onClick={() => eliminarProducto(producto.id)} className="btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar/Editar */}
      {modalOpen && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <button onClick={cerrarModal} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="producto-form">
              <input
                type="text"
                placeholder="Nombre del producto *"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
              />
              
              <textarea
                placeholder="Descripción *"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                required
                rows="3"
              />
              
              <input
                type="number"
                placeholder="Precio (Bs) *"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                step="0.01"
                required
              />
              
              <div className="form-group">
                <label>Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.imagen && (
                  <img src={formData.imagen} alt="Preview" className="image-preview" />
                )}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={cerrarModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SECCIÓN PEDIDOS (placeholder - usar tu Pedidos.jsx)
// ============================================
function SeccionPedidos({ token }) {
  return (
    <div className="seccion-pedidos">
      <div className="seccion-header">
        <h1>📦 Gestión de Pedidos</h1>
        <p>Importar componente Pedidos.jsx aquí</p>
      </div>
      <div className="placeholder-content">
        <ShoppingCart size={64} color="#2A9D8F" />
        <h2>Componente Pedidos</h2>
        <p>Aquí irá tu componente Pedidos.jsx completo</p>
      </div>
    </div>
  );
}

// ============================================
// SECCIÓN AGENDA (placeholder - usar tu AgendaEntregas.jsx)
// ============================================
function SeccionAgenda({ token }) {
  return (
    <div className="seccion-agenda">
      <div className="seccion-header">
        <h1>📅 Agenda de Entregas</h1>
        <p>Importar componente AgendaEntregas.jsx aquí</p>
      </div>
      <div className="placeholder-content">
        <Calendar size={64} color="#F4A261" />
        <h2>Componente Agenda</h2>
        <p>Aquí irá tu componente AgendaEntregas.jsx completo</p>
      </div>
    </div>
  );
}

export default AdminUnificado;