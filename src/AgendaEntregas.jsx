import { useState, useEffect } from 'react';
import { Calendar, Package, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './AgendaEntregas.css';

const API_URL = 'https://studio-ayni-backend.onrender.com/api';

function AgendaEntregas() {
  const [token] = useState(localStorage.getItem('token'));
  const [pedidos, setPedidos] = useState([]);
  const [vistaActual, setVistaActual] = useState('semana'); // 'semana' o 'mes'
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

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
      // Filtrar solo pedidos con fecha de entrega
      setPedidos(data.filter(p => p.fecha_entrega));
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
    }
  };

  const obtenerPedidosPorFecha = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return pedidos.filter(p => {
      if (!p.fecha_entrega) return false;
      const pedidoFecha = new Date(p.fecha_entrega).toISOString().split('T')[0];
      return pedidoFecha === fechaStr;
    });
  };

  const obtenerDiasSemana = () => {
    const inicio = new Date(fechaSeleccionada);
    inicio.setDate(inicio.getDate() - inicio.getDay()); // Domingo
    
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio);
      dia.setDate(inicio.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const cambiarSemana = (direccion) => {
    const nueva = new Date(fechaSeleccionada);
    nueva.setDate(nueva.getDate() + (direccion * 7));
    setFechaSeleccionada(nueva);
  };

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esPasado = (fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  };

  const obtenerColorEstado = (estado) => {
    const colores = {
      'pedido': '#E63946',
      'confirmado': '#F4A261',
      'proceso': '#2A9D8F',
      'realizado': '#264653',
      'entregado': '#6B7F3C'
    };
    return colores[estado] || '#999';
  };

  const diasSemana = obtenerDiasSemana();
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <div>
          <h1>📅 Agenda de Entregas</h1>
          <p>Visualiza entregas programadas</p>
        </div>
        
        <div className="agenda-controls">
          <button onClick={() => cambiarSemana(-1)} className="btn-nav">← Anterior</button>
          <button onClick={() => setFechaSeleccionada(new Date())} className="btn-hoy">Hoy</button>
          <button onClick={() => cambiarSemana(1)} className="btn-nav">Siguiente →</button>
        </div>
      </div>

      <div className="agenda-info">
        <h2>
          {nombresMeses[fechaSeleccionada.getMonth()]} {fechaSeleccionada.getFullYear()}
        </h2>
        <div className="agenda-stats">
          <div className="stat-item">
            <Package size={18} />
            <span>{pedidos.length} entregas programadas</span>
          </div>
          <div className="stat-item urgente">
            <AlertCircle size={18} />
            <span>{pedidos.filter(p => p.urgente).length} urgentes</span>
          </div>
        </div>
      </div>

      {/* Vista Semanal */}
      <div className="calendario-semanal">
        {diasSemana.map((dia, index) => {
          const pedidosDia = obtenerPedidosPorFecha(dia);
          const esHoyDia = esHoy(dia);
          const esPasadoDia = esPasado(dia);

          return (
            <div key={index} className={`dia-columna ${esHoyDia ? 'dia-hoy' : ''} ${esPasadoDia ? 'dia-pasado' : ''}`}>
              <div className="dia-header">
                <span className="dia-nombre">{nombresDias[dia.getDay()]}</span>
                <span className="dia-numero">{dia.getDate()}</span>
                {pedidosDia.length > 0 && (
                  <span className="dia-contador">{pedidosDia.length}</span>
                )}
              </div>

              <div className="dia-entregas">
                {pedidosDia.length === 0 ? (
                  <p className="sin-entregas">Sin entregas</p>
                ) : (
                  pedidosDia.map(pedido => (
                    <div 
                      key={pedido.id} 
                      className="entrega-card"
                      style={{ borderLeftColor: obtenerColorEstado(pedido.estado) }}
                    >
                      <div className="entrega-header">
                        <span className="entrega-id">#{pedido.id}</span>
                        {pedido.urgente && (
                          <AlertCircle size={14} className="icon-urgente" />
                        )}
                      </div>
                      
                      <p className="entrega-cliente">
                        {pedido.cliente?.nombre || pedido.cliente_nombre}
                      </p>
                      
                      {pedido.maquina && (
                        <p className="entrega-maquina">
                          🖨️ {pedido.maquina.split(' - ')[0]}
                        </p>
                      )}
                      
                      <div className="entrega-productos">
                        {(pedido.productos || []).slice(0, 1).map((prod, i) => (
                          <p key={i}>• {prod.cantidad}x {prod.nombre}</p>
                        ))}
                        {(pedido.productos || []).length > 1 && (
                          <p className="mas-productos">+ {pedido.productos.length - 1} más</p>
                        )}
                      </div>
                      
                      <div className="entrega-footer">
                        <span className={`entrega-estado ${pedido.estado}`}>
                          {pedido.estado === 'entregado' ? <CheckCircle size={12} /> :
                           pedido.estado === 'realizado' ? <Package size={12} /> :
                           <Clock size={12} />}
                          {pedido.estado}
                        </span>
                        <span className="entrega-total">Bs {pedido.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de Próximas Entregas */}
      <div className="proximas-entregas">
        <h3>📦 Próximas Entregas Importantes</h3>
        <div className="entregas-lista">
          {pedidos
            .filter(p => new Date(p.fecha_entrega) >= new Date())
            .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
            .slice(0, 5)
            .map(pedido => (
              <div key={pedido.id} className="entrega-item">
                <div className="entrega-fecha-badge">
                  <Calendar size={16} />
                  <span>{new Date(pedido.fecha_entrega).toLocaleDateString('es-BO', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="entrega-info">
                  <div className="entrega-titulo">
                    <strong>#{pedido.id} - {pedido.cliente?.nombre || pedido.cliente_nombre}</strong>
                    {pedido.urgente && (
                      <span className="badge-urgente">
                        <AlertCircle size={14} /> URGENTE
                      </span>
                    )}
                  </div>
                  <p className="entrega-detalle">
                    {(pedido.productos || []).length} producto(s) • Bs {pedido.total?.toFixed(2)}
                    {pedido.maquina && ` • ${pedido.maquina}`}
                  </p>
                </div>
                
                <div className="entrega-estado-badge" style={{ background: obtenerColorEstado(pedido.estado) }}>
                  {pedido.estado}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AgendaEntregas;