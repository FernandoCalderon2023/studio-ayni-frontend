// ============================================
// WRAPPERS PARA PÁGINAS ADMIN
// ============================================

import PageWrapper from './PageWrapper';
import Admin from './Admin';  // Tu componente de productos actual
import Pedidos from './Pedidos';  // Tu componente de pedidos actual
import AgendaEntregas from './AgendaEntregas';  // Tu componente de agenda actual

// Productos con botón volver
export function ProductosPage() {
  return (
    <PageWrapper titulo="Gestión de Productos" icono="📦">
      <Admin />
    </PageWrapper>
  );
}

// Pedidos con botón volver
export function PedidosPage() {
  return (
    <PageWrapper titulo="Gestión de Pedidos" icono="🛒">
      <Pedidos />
    </PageWrapper>
  );
}

// Agenda con botón volver
export function AgendaPage() {
  return (
    <PageWrapper titulo="Agenda de Entregas" icono="📅">
      <AgendaEntregas />
    </PageWrapper>
  );
}

// Estadísticas (placeholder)
export function EstadisticasPage() {
  return (
    <PageWrapper titulo="Estadísticas y Reportes" icono="📊">
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ color: '#264653', marginBottom: '1rem' }}>📊 Estadísticas Avanzadas</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Próximamente: Gráficas detalladas, reportes de ventas, análisis de tendencias y más.
        </p>
        <div style={{
          padding: '2rem',
          background: '#F8F9FA',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{ color: '#999', fontStyle: 'italic' }}>
            Esta sección está en desarrollo. Incluirá:
          </p>
          <ul style={{ 
            textAlign: 'left', 
            color: '#666',
            lineHeight: '2',
            marginTop: '1rem'
          }}>
            <li>📈 Gráficas de ventas por período</li>
            <li>💰 Análisis de ingresos</li>
            <li>👥 Comportamiento de clientes</li>
            <li>📊 Productos más rentables</li>
            <li>📅 Tendencias estacionales</li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}