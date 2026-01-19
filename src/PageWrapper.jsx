import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PageWrapper.css';

// Wrapper genérico para páginas admin
function PageWrapper({ children, titulo, icono }) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <button 
          className="btn-volver" 
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
        <div className="page-title">
          <span className="page-icon">{icono}</span>
          <h1>{titulo}</h1>
        </div>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;