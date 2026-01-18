import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Package, CheckCircle, Clock, Truck, DollarSign, Search } from 'lucide-react';
import './Pedidos.css';

const API_URL = 'https://studio-ayni-backend.onrender.com/api';

function Pedidos() {
  const [token] = useState(localStorage.getItem('token'));
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalPedido, setModalPedido] = useState(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  // Form states para agregar/editar
  const [formData, setFormData] = useState({
    clienteNombre: '',
    clienteWhatsapp: '',
    productos: [],
    total: 0,
    estadoPago: 'pendiente',
    montoAdelanto: 0,
    estado: 'pedido',
    notas: ''
  });

  const estados = [
    { id: 'pedido', nombre: 'Pedidos Nuevos', icon: Package, color: '#E63946' },
    { id: 'confirmado', nombre: 'Confirmados', icon: CheckCircle, color: '#F4A261' },
    { id: 'proceso', nombre: 'En Proceso', icon: Clock, color: '#2A9D8F' },
    { id: 'realizado', nombre: 'Realizados', icon: CheckCircle, color: '#264653' },
    { id: 'entregado', nombre: 'Entregados', icon: Truck, color: '#6B7F3C' }
  ];

  useEffect(() => {
    if (token) {
      cargarPedidos();
    }
  }, [token]);

  const cargarPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError('Error al cargar pedidos');
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        setSuccess(`✅ Estado actualizado a ${estados.find(e => e.id === nuevoEstado)?.nombre}`);
        cargarPedidos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('✅ Pedido eliminado');
        cargarPedidos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al eliminar pedido');
    }
  };

  const guardarPedido = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = modalPedido ? `${API_URL}/pedidos/${modalPedido.id}` : `${API_URL}/pedidos`;
      const method = modalPedido ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cliente: {
            nombre: formData.clienteNombre,
            whatsapp: formData.clienteWhatsapp
          },
          productos: formData.productos,
          total: formData.total,
          estado_pago: formData.estadoPago,
          monto_adelanto: formData.montoAdelanto,
          estado: formData.estado,
          notas: formData.notas
        })
      });

      if (response.ok) {
        setSuccess(modalPedido ? '✅ Pedido actualizado' : '✅ Pedido creado');
        cerrarModales();
        cargarPedidos();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al guardar pedido');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalDetalle = (pedido) => {
    setModalPedido(pedido);
    setFormData({
      clienteNombre: pedido.cliente?.nombre || pedido.cliente_nombre || '',
      clienteWhatsapp: pedido.cliente?.whatsapp || pedido.cliente_whatsapp || '',
      productos: pedido.productos || [],
      total: pedido.total || 0,
      estadoPago: pedido.estado_pago || 'pendiente',
      montoAdelanto: pedido.monto_adelanto || 0,
      estado: pedido.estado || 'pedido',
      notas: pedido.notas || ''
    });
  };

  const cerrarModales = () => {
    setModalPedido(null);
    setModalAgregar(false);
    setFormData({
      clienteNombre: '',
      clienteWhatsapp: '',
      productos: [],
      total: 0,
      estadoPago: 'pendiente',
      montoAdelanto: 0,
      estado: 'pedido',
      notas: ''
    });
  };

  const agregarProducto = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { nombre: '', cantidad: 1, precio: 0, color: '' }]
    });
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...formData.productos];
    nuevosProductos[index][campo] = valor;
    
    // Calcular total automáticamente
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
    
    setFormData({
      ...formData,
      productos: nuevosProductos,
      total: nuevoTotal
    });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    const nuevoTotal = nuevosProductos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
    
    setFormData({
      ...formData,
      productos: nuevosProductos,
      total: nuevoTotal
    });
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (!busqueda) return true;
    const search = busqueda.toLowerCase();
    return (
      pedido.cliente?.nombre?.toLowerCase().includes(search) ||
      pedido.cliente_nombre?.toLowerCase().includes(search) ||
      pedido.cliente?.whatsapp?.includes(search) ||
      pedido.cliente_whatsapp?.includes(search) ||
      pedido.id.toString().includes(search)
    );
  });

  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <div>
          <h1>📦 Gestión de Pedidos</h1>
          <p>STUDIO AYNI</p>
        </div>
        <button onClick={() => setModalAgregar(true)} className="btn-agregar-pedido">
          <Plus size={20} />
          Agregar Pedido
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* Barra de búsqueda */}
      <div className="pedidos-busqueda">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar por cliente, WhatsApp o ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Dashboard tipo Kanban */}
      <div className="pedidos-dashboard">
        {estados.map(estado => {
          const pedidosEstado = pedidosFiltrados.filter(p => p.estado === estado.id);
          const Icon = estado.icon;
          
          return (
            <div key={estado.id} className="pedidos-columna">
              <div className="columna-header" style={{ borderTopColor: estado.color }}>
                <Icon size={20} style={{ color: estado.color }} />
                <h3>{estado.nombre}</h3>
                <span className="pedidos-count">{pedidosEstado.length}</span>
              </div>
              
              <div className="columna-pedidos">
                {pedidosEstado.length === 0 ? (
                  <p className="columna-vacia">No hay pedidos</p>
                ) : (
                  pedidosEstado.map(pedido => (
                    <div key={pedido.id} className="pedido-card" onClick={() => abrirModalDetalle(pedido)}>
                      <div className="pedido-card-header">
                        <span className="pedido-id">#{pedido.id}</span>
                        <span className={`pedido-pago ${pedido.estado_pago || 'pendiente'}`}>
                          {pedido.estado_pago === 'pagado' ? '✓ Pagado' : 
                           pedido.estado_pago === 'adelanto' ? '◐ Adelanto' : '○ Pendiente'}
                        </span>
                      </div>
                      
                      <h4>{pedido.cliente?.nombre || pedido.cliente_nombre || 'Sin nombre'}</h4>
                      <p className="pedido-whatsapp">📱 {pedido.cliente?.whatsapp || pedido.cliente_whatsapp || 'N/A'}</p>
                      
                      <div className="pedido-productos-preview">
                        {(pedido.productos || []).slice(0, 2).map((prod, i) => (
                          <p key={i}>• {prod.cantidad}x {prod.nombre}{prod.colorSeleccionado ? ` (${prod.colorSeleccionado})` : ''}</p>
                        ))}
                        {(pedido.productos || []).length > 2 && <p>+ {pedido.productos.length - 2} más...</p>}
                      </div>
                      
                      <div className="pedido-total">
                        <DollarSign size={16} />
                        <strong>Bs {pedido.total?.toFixed(2) || '0.00'}</strong>
                      </div>
                      
                      <p className="pedido-fecha">
                        {new Date(pedido.created_at).toLocaleDateString('es-BO')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detalle/Editar Pedido */}
      {modalPedido && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-pedido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Pedido #{modalPedido.id}</h2>
              <button onClick={cerrarModales} className="btn-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={guardarPedido} className="pedido-form">
              {/* Información del Cliente */}
              <div className="form-section">
                <h3>👤 Cliente</h3>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.clienteNombre}
                  onChange={(e) => setFormData({...formData, clienteNombre: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={formData.clienteWhatsapp}
                  onChange={(e) => setFormData({...formData, clienteWhatsapp: e.target.value})}
                  required
                />
              </div>

              {/* Productos */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📦 Productos</h3>
                  <button type="button" onClick={agregarProducto} className="btn-add-small">
                    <Plus size={16} /> Agregar
                  </button>
                </div>
                
                {formData.productos.map((prod, index) => (
                  <div key={index} className="producto-row">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={prod.nombre}
                      onChange={(e) => actualizarProducto(index, 'nombre', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={prod.color || prod.colorSeleccionado || ''}
                      onChange={(e) => actualizarProducto(index, 'color', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Cant."
                      value={prod.cantidad}
                      onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                      style={{width: '80px'}}
                    />
                    <input
                      type="number"
                      placeholder="Precio"
                      value={prod.precio || prod.precioUnitario || 0}
                      onChange={(e) => actualizarProducto(index, 'precio', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      required
                      style={{width: '100px'}}
                    />
                    <button type="button" onClick={() => eliminarProducto(index)} className="btn-delete-small">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Estado y Pago */}
              <div className="form-section form-grid">
                <div>
                  <label>Estado del Pedido</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  >
                    {estados.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Estado de Pago</label>
                  <select
                    value={formData.estadoPago}
                    onChange={(e) => setFormData({...formData, estadoPago: e.target.value})}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="adelanto">Adelanto</option>
                    <option value="pagado">Pagado</option>
                  </select>
                </div>

                {formData.estadoPago === 'adelanto' && (
                  <div>
                    <label>Monto Adelanto (Bs)</label>
                    <input
                      type="number"
                      value={formData.montoAdelanto}
                      onChange={(e) => setFormData({...formData, montoAdelanto: parseFloat(e.target.value) || 0})}
                      step="0.01"
                      min="0"
                    />
                  </div>
                )}

                <div>
                  <label>Total (Bs)</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value) || 0})}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Notas */}
              <div className="form-section">
                <label>📝 Notas</label>
                <textarea
                  placeholder="Notas adicionales sobre el pedido..."
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  rows="3"
                />
              </div>

              {/* Resumen de Pago */}
              {formData.estadoPago === 'adelanto' && (
                <div className="pago-resumen">
                  <p>Total: <strong>Bs {formData.total.toFixed(2)}</strong></p>
                  <p>Adelanto: <strong>Bs {formData.montoAdelanto.toFixed(2)}</strong></p>
                  <p>Saldo: <strong>Bs {(formData.total - formData.montoAdelanto).toFixed(2)}</strong></p>
                </div>
              )}

              {/* Botones */}
              <div className="modal-footer">
                <button type="button" onClick={() => eliminarPedido(modalPedido.id)} className="btn-delete-pedido">
                  <Trash2 size={18} />
                  Eliminar
                </button>
                <button type="submit" className="btn-guardar-pedido" disabled={loading}>
                  {loading ? '⏳ Guardando...' : '✓ Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Pedido */}
      {modalAgregar && (
        <div className="modal-overlay" onClick={cerrarModales}>
          <div className="modal-pedido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Agregar Pedido Manual</h2>
              <button onClick={cerrarModales} className="btn-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={guardarPedido} className="pedido-form">
              {/* Cliente */}
              <div className="form-section">
                <h3>👤 Cliente</h3>
                <input
                  type="text"
                  placeholder="Nombre completo *"
                  value={formData.clienteNombre}
                  onChange={(e) => setFormData({...formData, clienteNombre: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp *"
                  value={formData.clienteWhatsapp}
                  onChange={(e) => setFormData({...formData, clienteWhatsapp: e.target.value})}
                  required
                />
              </div>

              {/* Productos */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📦 Productos</h3>
                  <button type="button" onClick={agregarProducto} className="btn-add-small">
                    <Plus size={16} /> Agregar Producto
                  </button>
                </div>
                
                {formData.productos.length === 0 ? (
                  <p className="help-text">Agrega al menos un producto</p>
                ) : (
                  formData.productos.map((prod, index) => (
                    <div key={index} className="producto-row">
                      <input
                        type="text"
                        placeholder="Nombre del producto *"
                        value={prod.nombre}
                        onChange={(e) => actualizarProducto(index, 'nombre', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={prod.color || ''}
                        onChange={(e) => actualizarProducto(index, 'color', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Cantidad *"
                        value={prod.cantidad}
                        onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value) || 0)}
                        min="1"
                        required
                        style={{width: '80px'}}
                      />
                      <input
                        type="number"
                        placeholder="Precio Bs *"
                        value={prod.precio}
                        onChange={(e) => actualizarProducto(index, 'precio', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        required
                        style={{width: '100px'}}
                      />
                      <button type="button" onClick={() => eliminarProducto(index)} className="btn-delete-small">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Estado de Pago */}
              <div className="form-section form-grid">
                <div>
                  <label>Estado de Pago *</label>
                  <select
                    value={formData.estadoPago}
                    onChange={(e) => setFormData({...formData, estadoPago: e.target.value})}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="adelanto">Adelanto</option>
                    <option value="pagado">Pagado</option>
                  </select>
                </div>

                {formData.estadoPago === 'adelanto' && (
                  <div>
                    <label>Monto Adelanto (Bs) *</label>
                    <input
                      type="number"
                      value={formData.montoAdelanto}
                      onChange={(e) => setFormData({...formData, montoAdelanto: parseFloat(e.target.value) || 0})}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Total calculado automáticamente */}
              <div className="total-calculado">
                <h3>Total: Bs {formData.total.toFixed(2)}</h3>
              </div>

              {/* Notas */}
              <div className="form-section">
                <label>📝 Notas (Opcional)</label>
                <textarea
                  placeholder="Notas adicionales..."
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
                  rows="3"
                />
              </div>

              {/* Botones */}
              <div className="modal-footer">
                <button type="button" onClick={cerrarModales} className="btn-cancelar">
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar-pedido" disabled={loading || formData.productos.length === 0}>
                  {loading ? '⏳ Creando...' : '✓ Crear Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;