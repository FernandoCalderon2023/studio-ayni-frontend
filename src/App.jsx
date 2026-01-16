import { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight,
  Instagram,
  Facebook,
  MessageCircle,
  Mail
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://studio-ayni-backend.onrender.com/api';

function App() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [scrollCarrusel, setScrollCarrusel] = useState(0);

  const categorias = ['Todo', 'Hogar', 'Organizadores', 'Joyería', 'Maquillaje', 'Bebés', 'Gadgets'];

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [productos, categoriaActiva, busqueda]);

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const filtrarProductos = () => {
    let filtrados = productos;

    if (categoriaActiva !== 'Todo') {
      filtrados = filtrados.filter(p => p.categoria === categoriaActiva);
    }

    if (busqueda.trim()) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setProductosFiltrados(filtrados);
  };

  const productosDestacados = productos.filter(p => p.novedad);

  const abrirDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setColorSeleccionado(producto.colores && producto.colores.length > 0 ? producto.colores[0] : null);
  };

  const cerrarDetalleProducto = () => {
    setProductoSeleccionado(null);
    setColorSeleccionado(null);
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const color = colorSeleccionado || { nombre: 'Por defecto', hex: '#FFFFFF' };
    const productoCarrito = {
      ...producto,
      cantidad,
      color: color.nombre,
      colorHex: color.hex,
      precioUnitario: producto.precio
    };

    const existe = carrito.find(
      item => item.id === producto.id && item.color === color.nombre
    );

    if (existe) {
      setCarrito(carrito.map(item =>
        item.id === producto.id && item.color === color.nombre
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, productoCarrito]);
    }

    cerrarDetalleProducto();
  };

  const actualizarCantidad = (id, color, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(id, color);
      return;
    }
    setCarrito(carrito.map(item =>
      item.id === id && item.color === color
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const eliminarDelCarrito = (id, color) => {
    setCarrito(carrito.filter(item => !(item.id === id && item.color === color)));
  };

  const calcularTotal = () => {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalUnidades = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const descuento = totalUnidades >= 12 ? subtotal * 0.10 : 0;
    return {
      subtotal,
      descuento,
      total: subtotal - descuento,
      totalUnidades
    };
  };

  const scrollCarruselIzquierda = () => {
    setScrollCarrusel(Math.max(0, scrollCarrusel - 1));
  };

  const scrollCarruselDerecha = () => {
    const maxScroll = Math.max(0, productosDestacados.length - 3);
    setScrollCarrusel(Math.min(maxScroll, scrollCarrusel + 1));
  };

  const { subtotal, descuento, total, totalUnidades } = calcularTotal();

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-2xl md:text-3xl font-bold">
                <span className="text-gris-oscuro">STUDIO </span>
                <span className="text-oliva">AYNI</span>
              </div>
            </div>

            {/* Buscador */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-oliva"
                />
              </div>
            </div>

            {/* Carrito */}
            <button
              onClick={() => setMostrarCarrito(true)}
              className="relative bg-oliva text-white p-3 rounded-full hover:bg-marron transition-colors"
            >
              <ShoppingCart size={24} />
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracota text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-oliva to-marron text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Diseño Funcional para tu Espacio
          </h1>
          <p className="text-xl md:text-2xl text-beige">
            Piezas únicas creadas con impresión 3D de precisión
          </p>
        </div>
      </section>

      {/* Novedades del Mes */}
      {productosDestacados.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gris-oscuro flex items-center gap-2">
                ✨ Novedades del Mes
              </h2>
              {productosDestacados.length > 3 && (
                <div className="flex gap-2">
                  <button
                    onClick={scrollCarruselIzquierda}
                    disabled={scrollCarrusel === 0}
                    className="p-2 rounded-full bg-oliva text-white hover:bg-marron transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={scrollCarruselDerecha}
                    disabled={scrollCarrusel >= productosDestacados.length - 3}
                    className="p-2 rounded-full bg-oliva text-white hover:bg-marron transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500"
                style={{
                  transform: `translateX(-${scrollCarrusel * (100 / 3 + 2)}%)`
                }}
              >
                {productosDestacados.map((producto) => (
                  <div
                    key={producto.id}
                    className="min-w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => abrirDetalleProducto(producto)}
                  >
                    <div className="relative">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-64 object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-terracota text-white px-3 py-1 rounded-full text-sm font-bold">
                        ¡Nuevo!
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{producto.nombre}</h3>
                      <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-oliva">Bs {producto.precio.toFixed(2)}</span>
                        <button className="bg-oliva text-white px-4 py-2 rounded-lg hover:bg-marron transition-colors">
                          Ver más
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filtros de Categoría */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  categoriaActiva === categoria
                    ? 'bg-oliva text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Productos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
                  onClick={() => abrirDetalleProducto(producto)}
                >
                  <div className="relative">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-64 object-cover"
                    />
                    {producto.novedad && (
                      <span className="absolute top-2 right-2 bg-terracota text-white px-3 py-1 rounded-full text-xs font-bold">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{producto.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2 uppercase">{producto.categoria}</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-oliva">Bs {producto.precio.toFixed(2)}</span>
                      <button className="bg-oliva text-white px-4 py-2 rounded-lg hover:bg-marron transition-colors">
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalle de Producto */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{productoSeleccionado.nombre}</h2>
              <button
                onClick={cerrarDetalleProducto}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Imagen */}
                <div>
                  <img
                    src={colorSeleccionado?.imagen || productoSeleccionado.imagen}
                    alt={productoSeleccionado.nombre}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                {/* Detalles */}
                <div>
                  <span className="inline-block bg-oliva text-white px-3 py-1 rounded-full text-sm font-medium mb-4 uppercase">
                    {productoSeleccionado.categoria}
                  </span>

                  {/* Colores */}
                  {productoSeleccionado.colores && productoSeleccionado.colores.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold mb-3">Colores Disponibles</h3>
                      <div className="flex gap-3">
                        {productoSeleccionado.colores.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setColorSeleccionado(color)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              colorSeleccionado?.nombre === color.nombre
                                ? 'border-oliva scale-110'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.nombre}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Color seleccionado: <span className="font-medium">{colorSeleccionado?.nombre}</span>
                      </p>
                    </div>
                  )}

                  {/* Cantidad */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Cantidad</h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const input = document.getElementById('cantidad-input');
                          input.value = Math.max(1, parseInt(input.value) - 1);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        id="cantidad-input"
                        type="number"
                        defaultValue="1"
                        min="1"
                        className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 font-bold text-lg"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('cantidad-input');
                          input.value = parseInt(input.value) + 1;
                        }}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Descripción</h3>
                    <p className="text-gray-600">{productoSeleccionado.descripcion}</p>
                    <p className="text-gray-500 text-sm mt-3 italic">
                      Este producto está fabricado con materiales de alta calidad mediante impresión 3D de precisión. 
                      Diseñado con atención al detalle para ofrecer funcionalidad y estética en tu espacio.
                    </p>
                  </div>

                  {/* Características */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Características</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Impresión 3D de alta calidad</li>
                      <li>Material resistente y duradero</li>
                      <li>Diseño funcional y estético</li>
                      <li>Acabado profesional</li>
                    </ul>
                  </div>

                  {/* Precio y Botón */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-oliva">Bs {productoSeleccionado.precio.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        const cantidad = parseInt(document.getElementById('cantidad-input').value);
                        agregarAlCarrito(productoSeleccionado, cantidad);
                      }}
                      className="w-full bg-oliva text-white py-3 rounded-lg font-bold hover:bg-marron transition-colors"
                    >
                      AGREGAR AL CARRITO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Carrito */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-2xl md:rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Tu Carrito</h2>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Items del carrito */}
                  <div className="space-y-4 mb-6">
                    {carrito.map((item) => (
                      <div key={`${item.id}-${item.color}`} className="flex gap-4 border-b pb-4">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold">{item.nombre}</h3>
                          <p className="text-sm text-gray-600">Color: {item.color}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => actualizarCantidad(item.id, item.color, item.cantidad - 1)}
                              className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-8 text-center">{item.cantidad}</span>
                            <button
                              onClick={() => actualizarCantidad(item.id, item.color, item.cantidad + 1)}
                              className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-oliva">Bs {(item.precio * item.cantidad).toFixed(2)}</p>
                          <button
                            onClick={() => eliminarDelCarrito(item.id, item.color)}
                            className="text-red-500 text-sm hover:underline mt-2"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalUnidades} items):</span>
                      <span className="font-bold">Bs {subtotal.toFixed(2)}</span>
                    </div>
                    {descuento > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento (10% en 12+):</span>
                        <span className="font-bold">-Bs {descuento.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-oliva">Bs {total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botón de Checkout */}
                  <button
                    onClick={() => {
                      setMostrarCarrito(false);
                      setMostrarCheckout(true);
                    }}
                    className="w-full bg-oliva text-white py-3 rounded-lg font-bold hover:bg-marron transition-colors mt-6"
                  >
                    FINALIZAR COMPRA
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {mostrarCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Finalizar Compra</h2>
              <button
                onClick={() => setMostrarCheckout(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Resumen del pedido */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Resumen del Pedido</h3>
                {carrito.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex justify-between text-sm mb-2">
                    <span>{item.nombre} ({item.color}) x{item.cantidad}</span>
                    <span className="font-bold">Bs {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-3 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-oliva">Bs {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Opciones de compra */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Elige cómo deseas continuar:</h3>

                {/* Opción 1: Reserva Online */}
                <div className="border-2 border-oliva rounded-lg p-4">
                  <h4 className="font-bold mb-2">📝 Reserva Online</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Completa tus datos y reserva tu pedido. Te contactaremos para confirmar.
                  </p>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const pedido = {
                        cliente: {
                          nombre: formData.get('nombre'),
                          email: formData.get('email'),
                          telefono: formData.get('telefono')
                        },
                        productos: carrito,
                        total,
                        metodoPago: 'reserva'
                      };

                      try {
                        const response = await fetch(`${API_URL}/pedidos`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(pedido)
                        });

                        if (response.ok) {
                          alert('¡Pedido reservado! Te contactaremos pronto.');
                          setCarrito([]);
                          setMostrarCheckout(false);
                        }
                      } catch (error) {
                        console.error('Error:', error);
                        alert('Error al procesar el pedido');
                      }
                    }}
                  >
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        required
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        required
                        className="w-full p-2 border rounded-lg"
                      />
                      <button
                        type="submit"
                        className="w-full bg-oliva text-white py-2 rounded-lg font-bold hover:bg-marron transition-colors"
                      >
                        RESERVAR PEDIDO
                      </button>
                    </div>
                  </form>
                </div>

                {/* Opción 2: WhatsApp */}
                <div className="border-2 border-green-500 rounded-lg p-4">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <MessageCircle size={20} className="text-green-500" />
                    Pedir por WhatsApp
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Envía tu pedido directamente por WhatsApp y coordina los detalles.
                  </p>
                  <button
                    onClick={() => {
                      const mensaje = `¡Hola! Quiero hacer un pedido:\n\n${carrito.map(item =>
                        `${item.nombre} (${item.color}) x${item.cantidad} - Bs ${(item.precio * item.cantidad).toFixed(2)}`
                      ).join('\n')}\n\nTotal: Bs ${total.toFixed(2)}${descuento > 0 ? ` (incluye descuento de Bs ${descuento.toFixed(2)})` : ''}`;

                      window.open(`https://wa.me/message/WA4J7PMW6D4KP1?text=${encodeURIComponent(mensaje)}`);
                    }}
                    className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    ABRIR WHATSAPP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/message/WA4J7PMW6D4KP1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50"
        title="Contáctanos por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Footer */}
      <footer className="bg-gris-oscuro text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Columna 1 - Información */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-terracota">STUDIO AYNI</h3>
              <p className="text-gray-300 mb-4">
                Natural Sophistication
              </p>
              <p className="text-gray-400 text-sm">
                Diseño funcional para tu espacio mediante impresión 3D de precisión
              </p>
            </div>
            
            {/* Columna 2 - Enlaces Rápidos */}
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#productos" className="text-gray-300 hover:text-terracota transition-colors">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="#novedades" className="text-gray-300 hover:text-terracota transition-colors">
                    Novedades
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Columna 3 - Redes Sociales */}
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.instagram.com/studio.ayni3d?igsh=MTZzazV6NWJsZWR2NQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-terracota transition-all duration-300"
                  title="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="https://www.facebook.com/share/1Bf9QJhgJe/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-terracota transition-all duration-300"
                  title="Facebook"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://wa.me/message/WA4J7PMW6D4KP1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-terracota transition-all duration-300"
                  title="WhatsApp"
                >
                  <MessageCircle size={24} />
                </a>
              </div>
            </div>
            
            {/* Columna 4 - Contacto */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <div className="space-y-3 text-gray-300">
                <a 
                  href="https://wa.me/message/WA4J7PMW6D4KP1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-terracota transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
            
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Studio AYNI. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">Natural Sophistication</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;