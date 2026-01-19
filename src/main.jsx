import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './Admin';
import Pedidos from './Pedidos';  // ← AGREGAR
import AgendaEntregas from './AgendaEntregas';
import AdminUnificado from './AdminUnificado';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pedidos" element={<Pedidos />} />  {/* ← NUEVA RUTA */}
        <Route path="/agenda" element={<AgendaEntregas />} />
        <Route path="/admin/panel" element={<AdminUnificado />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);