import { useState, useEffect } from 'react';
import { ShoppingCart, Search, X, ChevronLeft, ChevronRight, Instagram, Facebook, Mail, Phone as PhoneIcon, MapPin, ArrowLeft, Plus, Minus, Sparkles, MessageCircle } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://studio-ayni-backend.onrender.com/api';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [novedadesScroll, setNovedadesScroll] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    referencia: '',
    metodoPago: 'efectivo'
  });
  const productsPerPage = 12;

  const [productos, setProductos] = useState([
    // HOGAR
    
  ]);

  // Cargar productos desde el backend
  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProductos(data);
        }
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  const categorias = [
    { id: 'todos', nombre: 'Todo' },
    { id: 'hogar', nombre: 'Hogar' },
    { id: 'organizadores', nombre: 'Organizadores' },
    { id: 'joyeria', nombre: 'Joyería' },
    { id: 'maquillaje', nombre: 'Maquillaje' },
    { id: 'bebes', nombre: 'Bebés' },
    { id: 'gadgets', nombre: 'Gadgets' }
  ];

  // Productos destacados (novedades)
  const productosDestacados = productos.filter(p => p.novedad).slice(0, 5);

  // Navegación del carrusel de novedades
  const scrollNovedades = (direction) => {
    const container = document.querySelector('.novedades-carousel');
    if (container) {
      const scrollAmount = 280; // Ancho de una tarjeta + gap
      const newScroll = direction === 'left' 
        ? Math.max(0, novedadesScroll - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, novedadesScroll + scrollAmount);
      
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
      setNovedadesScroll(newScroll);
    }
  };

  // Abrir modal y setear primer color por defecto
  const openProductModal = (producto) => {
    setSelectedProduct(producto);
    setSelectedColor(producto.colores ? producto.colores[0] : null);
    setQuantity(1);
  };

  // Cerrar modal y resetear
  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    setQuantity(1);
  };

  // Cambiar cantidad
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Precio con descuento por cantidad
  const getPrecioConDescuento = (precioBase, cant) => {
    if (cant >= 12) {
      return precioBase * 0.9; // 10% descuento
    }
    return precioBase;
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = selectedCategory === 'todos' || producto.categoria === selectedCategory;
    const matchBusqueda = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Calcular paginación
  const totalPages = Math.ceil(productosFiltrados.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resetear a página 1 cuando cambia categoría o búsqueda
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const addToCart = (producto, colorSeleccionado, cantidad) => {
    const precioFinal = getPrecioConDescuento(producto.precio, cantidad);
    const productoConDetalles = {
      ...producto,
      colorSeleccionado: colorSeleccionado ? colorSeleccionado.nombre : null,
      precioUnitario: precioFinal,
      cantidad: cantidad
    };
    
    const existing = cartItems.find(item => 
      item.id === producto.id && 
      item.colorSeleccionado === productoConDetalles.colorSeleccionado
    );
    
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.id === producto.id && item.colorSeleccionado === productoConDetalles.colorSeleccionado
          ? { ...item, cantidad: item.cantidad + cantidad, precioUnitario: getPrecioConDescuento(producto.precio, item.cantidad + cantidad) }
          : item
      ));
    } else {
      setCartItems([...cartItems, productoConDetalles]);
    }
    
    closeProductModal();
  };

  const removeFromCart = (id, colorSeleccionado) => {
    setCartItems(cartItems.filter(item => 
      !(item.id === id && item.colorSeleccionado === colorSeleccionado)
    ));
  };

  const updateQuantity = (id, colorSeleccionado, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id, colorSeleccionado);
    } else {
      setCartItems(cartItems.map(item => {
        if (item.id === id && item.colorSeleccionado === colorSeleccionado) {
          const precioActualizado = getPrecioConDescuento(item.precio, cantidad);
          return { ...item, cantidad, precioUnitario: precioActualizado };
        }
        return item;
      }));
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);

  // Sistema de checkout
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    const pedido = {
      cliente: checkoutData,
      productos: cartItems,
      total: total,
      fecha: new Date().toISOString()
    };

    // Enviar pedido al backend
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        alert('¡Pedido realizado con éxito! Te contactaremos pronto.');
        setCartItems([]);
        setCheckoutOpen(false);
        setCheckoutData({
          nombre: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          referencia: '',
          metodoPago: 'efectivo'
        });
      }
    } catch (error) {
      console.error('Error al realizar pedido:', error);
    }
  };

  const enviarPedidoWhatsApp = () => {
    const mensaje = cartItems.map(item => {
      const colorInfo = item.colorSeleccionado ? ` (${item.colorSeleccionado})` : '';
      const descuento = item.cantidad >= 12 ? ' [10% DESC]' : '';
      return `${item.cantidad}x ${item.nombre}${colorInfo}${descuento} - Bs ${(item.precioUnitario * item.cantidad).toFixed(2)}`;
    }).join('\n');
    const mensajeTotal = `*PEDIDO STUDIO AYNI*\n\n${mensaje}\n\n*Total: Bs ${total.toFixed(2)}*`;
    const url = `https://wa.me/message/WA4J7PMW6D4KP1?text=${encodeURIComponent(mensajeTotal)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="tienda-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-studio">STUDIO</span>
            <span className="logo-ayni">AYNI</span>
          </div>
          <div className="nav-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="search-icon" size={16} />
            </div>
            <button className="icon-button" onClick={() => setCartOpen(!cartOpen)}>
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Diseño Funcional para tu Espacio</h1>
        <p>Piezas únicas creadas con impresión 3D de precisión</p>
      </section>

      {/* Novedades del Mes */}
      {productosDestacados.length > 0 && (
        <section className="novedades">
          <div className="novedades-header">
            <div className="novedades-title">
              <Sparkles size={24} />
              <h2>Novedades del Mes</h2>
            </div>
            <div className="novedades-nav">
              <button 
                className="nav-arrow nav-arrow-left" 
                onClick={() => scrollNovedades('left')}
                disabled={novedadesScroll === 0}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow nav-arrow-right" 
                onClick={() => scrollNovedades('right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <div className="novedades-carousel">
            {productosDestacados.map((producto) => (
              <div 
                key={producto.id} 
                className="novedad-card"
                onClick={() => openProductModal(producto)}
              >
                <div className="novedad-badge">NUEVO</div>
                <img 
                  src={producto.imagen?.startsWith('http') ? producto.imagen : `http://localhost:3001${producto.imagen}`} 
                  alt={producto.nombre} 
                />
                <div className="novedad-info">
                  <h3>{producto.nombre}</h3>
                  <p className="novedad-price">Bs {producto.precio.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="categories">
        <div className="category-grid">
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products">
        <div className="product-grid">
          {currentProducts.map((producto) => (
            <div key={producto.id} className="product-card">
              <img 
                src={producto.imagen?.startsWith('http') ? producto.imagen : `http://localhost:3001${producto.imagen}`} 
                alt={producto.nombre} 
                className="product-image" 
                onClick={() => openProductModal(producto)}
              />
              <div className="product-info">
                <h3 className="product-name">{producto.nombre}</h3>
                <p className="product-description">{producto.descripcion}</p>
                <div className="product-footer">
                  <span className="product-price">Bs {producto.precio.toFixed(2)}</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => openProductModal(producto)}
                  >
                    AGREGAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button 
              className="pagination-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      {/* Footer con Redes Sociales ACTUALIZADAS */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-studio">STUDIO</span>
              <span className="footer-logo-ayni">AYNI</span>
            </div>
            <p className="footer-tagline">Natural Sophistication</p>
            <p className="footer-description">Diseño funcional para tu espacio mediante impresión 3D de precisión</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Síguenos</h3>
            <div className="social-links">
              <a href="https://www.instagram.com/studio.ayni3d?igsh=MTZzazV6NWJsZWR2NQ==" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/share/1Bf9QJhgJe/" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
                <span>Facebook</span>
              </a>
              <a href="https://wa.me/message/WA4J7PMW6D4KP1" target="_blank" rel="noopener noreferrer" className="social-link">
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <div className="contact-info">
              <a href="https://wa.me/message/WA4J7PMW6D4KP1" className="contact-item" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
              <div className="contact-item">
                <MapPin size={18} />
                <span>La Paz, Bolivia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Studio AYNI. Todos los derechos reservados.</p>
          <p className="footer-tagline-bottom">Natural Sophistication</p>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/message/WA4J7PMW6D4KP1"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Contáctanos por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Modal de Producto CON CANTIDAD */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-back" onClick={closeProductModal}>
              <ArrowLeft size={24} />
              <span>Volver</span>
            </button>
            
            <button className="modal-close" onClick={closeProductModal}>
              <X size={24} />
            </button>
            
            <div className="modal-content">
              <div className="modal-image-container">
                <div className="modal-image-wrapper">
                  <img 
                    src={(selectedColor ? selectedColor.imagen : selectedProduct.imagen)?.startsWith('http') ? 
                         (selectedColor ? selectedColor.imagen : selectedProduct.imagen) : 
                         `http://localhost:3001${selectedColor ? selectedColor.imagen : selectedProduct.imagen}`} 
                    alt={selectedProduct.nombre} 
                    className="modal-image"
                  />
                </div>
              </div>
              
              <div className="modal-info">
                <h2 className="modal-product-name">{selectedProduct.nombre}</h2>
                <p className="modal-product-category">
                  {categorias.find(cat => cat.id === selectedProduct.categoria)?.nombre}
                </p>
                
                {/* Selector de Colores */}
                {selectedProduct.colores && selectedProduct.colores.length > 0 && (
                  <div className="color-selector">
                    <h3>Colores Disponibles</h3>
                    <div className="color-options">
                      {selectedProduct.colores.map((color, index) => (
                        <button
                          key={index}
                          className={`color-circle ${selectedColor?.nombre === color.nombre ? 'active' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setSelectedColor(color)}
                          title={color.nombre}
                        >
                          {selectedColor?.nombre === color.nombre && (
                            <span className="color-check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="selected-color-name">
                      Color seleccionado: <strong>{selectedColor?.nombre}</strong>
                    </p>
                  </div>
                )}

                {/* SELECTOR DE CANTIDAD */}
                <div className="quantity-selector">
                  <h3>Cantidad</h3>
                  <div className="quantity-controls-large">
                    <button onClick={decrementQuantity} className="qty-btn-large">
                      <Minus size={20} />
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button onClick={incrementQuantity} className="qty-btn-large">
                      <Plus size={20} />
                    </button>
                  </div>
                  {quantity >= 12 && (
                    <p className="descuento-aviso">🎉 ¡10% de descuento por 12 o más unidades!</p>
                  )}
                </div>
                
                <div className="modal-product-description">
                  <h3>Descripción</h3>
                  <p>{selectedProduct.descripcion}</p>
                  <p className="description-extra">
                    Este producto está fabricado con materiales de alta calidad mediante impresión 3D de precisión. 
                    Diseñado con atención al detalle para ofrecer funcionalidad y estética en tu espacio.
                  </p>
                </div>
                
                <div className="modal-product-features">
                  <h3>Características</h3>
                  <ul>
                    <li>✓ Impresión 3D de alta calidad</li>
                    <li>✓ Materiales resistentes y duraderos</li>
                    <li>✓ Diseño personalizable</li>
                    <li>✓ Acabado profesional</li>
                  </ul>
                </div>
                
                {/* PRECIOS */}
                <div className="modal-pricing">
                  <div className="price-row">
                    <span className="price-label">Precio unitario:</span>
                    <span className="price-value">Bs {getPrecioConDescuento(selectedProduct.precio, quantity).toFixed(2)}</span>
                  </div>
                  <div className="price-row total-row">
                    <span className="price-label">Total ({quantity} {quantity === 1 ? 'unidad' : 'unidades'}):</span>
                    <span className="price-value-total">Bs {(getPrecioConDescuento(selectedProduct.precio, quantity) * quantity).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    className="modal-add-to-cart"
                    onClick={() => addToCart(selectedProduct, selectedColor, quantity)}
                  >
                    <ShoppingCart size={20} />
                    AGREGAR AL CARRITO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Carrito</h2>
          <button className="close-cart" onClick={() => setCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart className="empty-cart-icon" size={60} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.colorSeleccionado}-${index}`} className="cart-item">
                <div className="cart-item-header">
                  <span className="cart-item-name">
                    {item.nombre}
                    {item.colorSeleccionado && (
                      <span className="cart-item-color"> ({item.colorSeleccionado})</span>
                    )}
                  </span>
                  <button 
                    className="remove-item"
                    onClick={() => removeFromCart(item.id, item.colorSeleccionado)}
                  >
                    eliminar
                  </button>
                </div>
                <div className="cart-item-details">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.colorSeleccionado, item.cantidad - 1)}
                    >
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.colorSeleccionado, item.cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-price">
                    Bs {(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
                {item.cantidad >= 12 && (
                  <div className="cart-item-discount">10% descuento aplicado</div>
                )}
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="total-label">Total</span>
              <span className="total-amount">Bs {total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={() => setCheckoutOpen(true)}>
              REALIZAR PEDIDO
            </button>
            <button className="checkout-btn-whatsapp" onClick={enviarPedidoWhatsApp}>
              ENVIAR POR WHATSAPP
            </button>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="checkout-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <h2>Completar Pedido</h2>
              <button onClick={() => setCheckoutOpen(false)} className="close-checkout">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Información de Contacto</h3>
                <input
                  type="text"
                  placeholder="Nombre completo *"
                  value={checkoutData.nombre}
                  onChange={(e) => setCheckoutData({...checkoutData, nombre: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Teléfono/WhatsApp *"
                  value={checkoutData.telefono}
                  onChange={(e) => setCheckoutData({...checkoutData, telefono: e.target.value})}
                  required
                />
              </div>

              <div className="form-section">
                <h3>Dirección de Entrega</h3>
                <input
                  type="text"
                  placeholder="Ciudad *"
                  value={checkoutData.ciudad}
                  onChange={(e) => setCheckoutData({...checkoutData, ciudad: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Dirección completa *"
                  value={checkoutData.direccion}
                  onChange={(e) => setCheckoutData({...checkoutData, direccion: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Referencia (ej: cerca al parque)"
                  value={checkoutData.referencia}
                  onChange={(e) => setCheckoutData({...checkoutData, referencia: e.target.value})}
                />
              </div>

              <div className="form-section">
                <h3>Método de Pago</h3>
                <select
                  value={checkoutData.metodoPago}
                  onChange={(e) => setCheckoutData({...checkoutData, metodoPago: e.target.value})}
                >
                  <option value="efectivo">Efectivo contra entrega</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="qr">QR</option>
                </select>
              </div>

              <div className="checkout-summary">
                <h3>Resumen del Pedido</h3>
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span>{item.cantidad}x {item.nombre}</span>
                    <span>Bs {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total:</strong>
                  <strong>Bs {total.toFixed(2)}</strong>
                </div>
              </div>

              <button type="submit" className="submit-order-btn">
                CONFIRMAR PEDIDO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;