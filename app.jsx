const { useState, useEffect, useMemo } = React;

// ============================================================================
// 1. CONFIGURACIÓN DE URLS DEL SERVICIO CENTRAL (PLANTILLA OFICIAL TOKENS)
// ============================================================================
const LOGIN_CENTRAL_URL = 'plantilla_tokens/Frontend%20dos/login_dashboard.html';
const DASHBOARD_CENTRAL_URL = 'plantilla_tokens/Frontend%20dos/dashboard.html';
// Detección automática: en Docker (puerto 8090) usa ruta relativa; en desarrollo local usa puerto 8000
const AUTH_API_URL = (window.location.port === '8090' || window.location.port === '80' || !window.location.port)
  ? ''
  : 'http://127.0.0.1:8000';
const SUBPROYECTO_ID = 'despensa-digital';
const SUBPROYECTO_NOMBRE = 'Despensa Digital Comunitaria';
const BASE_API_URL = 'http://127.0.0.1:8083'; // Puerto API local de este servicio

// ============================================================================
// PREGUNTAS Y OPCIONES OFICIALES DEL MÓDULO DE ENCUESTA (TRAVESÍAS V2)
// ============================================================================
const PREGUNTAS_ENCUESTA = [
  { numero: 1, texto: 'Me resultó fácil aprender a utilizar este subproyecto.' },
  { numero: 2, texto: 'Pude encontrar fácilmente las opciones y funciones que necesitaba.' },
  { numero: 3, texto: 'La información y los textos de la interfaz fueron claros y comprensibles.' },
  { numero: 4, texto: 'Logré realizar las tareas que necesitaba sin dificultades innecesarias.' },
  { numero: 5, texto: 'En general, estoy satisfecho con la experiencia de uso de este subproyecto.' }
];

const OPCIONES_EVALUACION = [
  { valor: 1, emoji: '😡', etiqueta: 'Malo' },
  { valor: 2, emoji: '😬', etiqueta: 'Medio' },
  { valor: 3, emoji: '🤩', etiqueta: 'Excelente' }
];

// ============================================================================
// DATOS DE PRODUCTOS (IGUALES AL DISEÑO ORIGINAL)
// ============================================================================
const FEATURED_PRODUCTS = [
  {
    id: 101,
    name: 'Aguacates Orgánicos del Caquetá',
    category: 'Alimentos',
    price: '$ 12.000 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Malla por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description: 'Aguacates frescos cultivados sin agroquímicos por familias productoras de la región amazónica del Caquetá.'
  },
  {
    id: 102,
    name: 'Bolso Tejido Coreguaje',
    category: 'Artesanías',
    price: '$ 45.000',
    unit: '/ Unidad',
    available: true,
    presentation: 'Tejido artesanal en fibra natural',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    description: 'Bolso elaborado a mano con fibras naturales de cumare por artesanos indígenas de la comunidad Coreguaje.'
  },
  {
    id: 103,
    name: 'Café Amazónico Especial',
    category: 'Alimentos',
    price: '$ 18.000',
    unit: '/ 500 g',
    available: true,
    presentation: 'Bolsa con válvula desgasificadora 500g',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    description: 'Café de origen amazónico cultivado bajo sombra en sistemas agroforestales sostenibles del piedemonte caqueteño.'
  },
  {
    id: 104,
    name: 'Miel de Abejas Silvestre',
    category: 'Agricultura',
    price: '$ 25.000',
    unit: '/ 500 ml',
    available: true,
    presentation: 'Frasco de Vidrio 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'Miel 100% natural, recolectada de manera artesanal por estudiantes del programa de Ingeniería Agroecológica en bosques nativos del Caquetá. No contiene aditivos ni conservantes artificiales. Envase de vidrio esterilizado.'
  }
];

const INITIAL_CATALOG_PRODUCTS = [
  {
    id: 1,
    name: 'Bananos de Seda Frescos',
    category: 'Alimentos',
    price: '$ 5.000 / Mano',
    unit: '/ Mano',
    available: true,
    presentation: 'Mano fresca (~1.5 kg)',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    description: 'Bananos de seda dulces cosechados en parcelas comunitarias de productores locales.'
  },
  {
    id: 2,
    name: 'Piña Golden Amazónica',
    category: 'Alimentos',
    price: '$ 7.000 / Un',
    unit: '/ Unidad',
    available: true,
    presentation: 'Unidad seleccionada',
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
    description: 'Piña jugosa y dulce cultivada en suelos amazónicos con manejo agroecológico.'
  },
  {
    id: 3,
    name: 'Pulpa de Açaí Congelada',
    category: 'Alimentos',
    price: '$ 15.000 / 500g',
    unit: '/ 500 g',
    available: true,
    presentation: 'Empaque 500g',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    description: 'Pulpa pura de açaí amazónico cosechado de manera sostenible en el Caquetá.'
  },
  {
    id: 4,
    name: 'Tomates Chonto Orgánicos',
    category: 'Alimentos',
    price: '$ 4.500 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Bolsa por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: 'Tomates frescos de huerta comunitaria universitaria, libres de pesticidas.'
  },
  {
    id: 5,
    name: 'Limón Pajarito Uniamazonia',
    category: 'Alimentos',
    price: '$ 3.000 / kg',
    unit: '/ kg',
    available: true,
    presentation: 'Malla por 1 kg',
    imageUrl: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80',
    description: 'Limón pajarito de alto jugo producido en granjas experimentales y parcelas campesinas.'
  },
  {
    id: 6,
    name: 'Huevos Semicriollos',
    category: 'Alimentos',
    price: '$ 16.000 / Panal',
    unit: '/ Panal x30',
    available: true,
    presentation: 'Panal de 30 unidades',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Huevos semicriollos de gallinas criadas en pastoreo libre en granjas locales.'
  },
  ...FEATURED_PRODUCTS
];

const CATEGORIES = ['Alimentos', 'Agricultura', 'Artesanías'];

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
function App() {
  const [view, setView] = useState('home'); // 'home' | 'productos' | 'detalle' | 'admin' | 'adminNuevo'
  const [catalogProducts, setCatalogProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('despensa_productos_locales');
      return saved ? JSON.parse(saved) : INITIAL_CATALOG_PRODUCTS;
    } catch {
      return INITIAL_CATALOG_PRODUCTS;
    }
  });
  const [selectedProduct, setSelectedProduct] = useState(FEATURED_PRODUCTS[3]);
  const [searchQuery, setSearchQuery] = useState('');

  // Estado de sesión (Plantilla Oficial del Coordinador)
  const [usuarioFinal, setUsuarioFinal] = useState(null);
  const [tokenFinal, setTokenFinal] = useState(null);
  const [sesionValida, setSesionValida] = useState(false);

  // Guardar productos localmente (según indicación del coordinador de trabajar BD local)
  useEffect(() => {
    try {
      localStorage.setItem('despensa_productos_locales', JSON.stringify(catalogProducts));
    } catch (e) {
      console.error('Error guardando productos en almacenamiento local:', e);
    }
  }, [catalogProducts]);

  // 2. Método de validación (se ejecuta al iniciar la aplicación)
  useEffect(() => {
    validarYCargarSesion();
  }, []);

  function validarYCargarSesion() {
    const params = new URLSearchParams(window.location.search);
    const usuarioUrl = params.get('usuario');
    let tokenUrl = params.get('token');

    if (tokenUrl) {
      tokenUrl = tokenUrl.replace(/"/g, '').trim();
    }

    const usuarioSesion = sessionStorage.getItem('usuario') || sessionStorage.getItem('nombre_usuario');
    const tokenSesion = sessionStorage.getItem('token') || sessionStorage.getItem('access_token');

    if (tokenUrl && usuarioUrl && tokenUrl.length > 0 && usuarioUrl.length > 0) {
      setUsuarioFinal(usuarioUrl);
      setTokenFinal(tokenUrl);
      setSesionValida(true);

      sessionStorage.setItem('usuario', usuarioUrl);
      sessionStorage.setItem('token', tokenUrl);
      sessionStorage.setItem('nombre_usuario', usuarioUrl);
      sessionStorage.setItem('access_token', tokenUrl);

      window.history.replaceState({}, '', window.location.pathname);
    } else if (tokenSesion && usuarioSesion && tokenSesion.length > 0 && usuarioSesion.length > 0) {
      setUsuarioFinal(usuarioSesion);
      setTokenFinal(tokenSesion);
      setSesionValida(true);
    } else {
      setSesionValida(false);
    }
  }

  // 3. Salida y navegación según la plantilla oficial del coordinador
  function irAlLoginCentral() {
    window.location.href = LOGIN_CENTRAL_URL;
  }

  function cerrarSesion() {
    sessionStorage.clear();
    setUsuarioFinal(null);
    setTokenFinal(null);
    setSesionValida(false);
    window.location.href = LOGIN_CENTRAL_URL;
  }

  function volverAlDashboard() {
    window.location.href = DASHBOARD_CENTRAL_URL;
  }

  function handleOpenDetail(product) {
    setSelectedProduct(product);
    setView('detalle');
    window.scrollTo(0, 0);
  }

  function handleNavigate(targetView) {
    if (targetView === 'login') {
      irAlLoginCentral();
      return;
    }
    if ((targetView === 'admin' || targetView === 'adminNuevo') && !sesionValida) {
      irAlLoginCentral();
      return;
    }
    setView(targetView);
    window.scrollTo(0, 0);
  }

  function handleAddProduct(newProd) {
    const created = {
      ...newProd,
      id: Date.now()
    };
    setCatalogProducts([created, ...catalogProducts]);
    setView('admin');
  }

  function handleDeleteProduct(id) {
    if (window.confirm('¿Eliminar este producto de la lista?')) {
      setCatalogProducts(catalogProducts.filter(p => p.id !== id));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {view === 'home' && (
        <>
          <TopBanner />
          <PublicNavbar
            active="home"
            isHome={true}
            onNavigate={handleNavigate}
            sesionValida={sesionValida}
            usuario={usuarioFinal}
          />
          <HomeView
            featuredProducts={FEATURED_PRODUCTS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onExplore={() => handleNavigate('productos')}
            onSelectProduct={handleOpenDetail}
          />
          <Footer onNavigate={handleNavigate} />
          <WhatsappFab />
        </>
      )}

      {view === 'productos' && (
        <>
          <PublicNavbar
            active="productos"
            onNavigate={handleNavigate}
            sesionValida={sesionValida}
            usuario={usuarioFinal}
            showSearch={true}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ProductsView
            products={catalogProducts}
            searchQuery={searchQuery}
            onSelectProduct={handleOpenDetail}
          />
          <WhatsappFab />
        </>
      )}

      {view === 'detalle' && (
        <>
          <PublicNavbar
            active="productos"
            onNavigate={handleNavigate}
            sesionValida={sesionValida}
            usuario={usuarioFinal}
          />
          <DetailView
            product={selectedProduct}
            relatedProducts={FEATURED_PRODUCTS.slice(0, 3)}
            onBack={() => handleNavigate('productos')}
            onSelectProduct={handleOpenDetail}
          />
          <WhatsappFab />
        </>
      )}

      {view === 'encuesta' && (
        <>
          <PublicNavbar
            active="encuesta"
            onNavigate={handleNavigate}
            sesionValida={sesionValida}
            usuario={usuarioFinal}
          />
          <EncuestaUsabilidadView
            subproyectoId={SUBPROYECTO_ID}
            nombreSubproyecto={SUBPROYECTO_NOMBRE}
            token={tokenFinal}
            usuario={usuarioFinal}
            sesionValida={sesionValida}
            onIrLogin={irAlLoginCentral}
            onCancelar={() => handleNavigate('home')}
          />
          <Footer onNavigate={handleNavigate} />
          <WhatsappFab />
        </>
      )}

      {(view === 'admin' || view === 'adminNuevo' || view === 'adminEncuestas') && (
        <AdminView
          mode={view}
          usuario={usuarioFinal || 'Administrador'}
          products={catalogProducts}
          onNavigate={handleNavigate}
          onDelete={handleDeleteProduct}
          onSaveProduct={handleAddProduct}
          onVolverDashboard={volverAlDashboard}
          onCerrarSesion={cerrarSesion}
        />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTES DE NAVEGACIÓN (CON SOPORTE RESPONSIVE DESKTOP + DRAWER MÓVIL)
// ============================================================================
function TopBanner() {
  return (
    <div className="top-banner">
      Apoya el desarrollo local: Compra directa a productores de la Universidad de la Amazonia
    </div>
  );
}

function PublicNavbar({ active, isHome, onNavigate, sesionValida, usuario, showSearch, searchQuery, setSearchQuery }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className={`navbar ${isHome ? 'home-nav' : ''}`}>
        <div className="navbar-inner">
          <div className="brand" onClick={() => onNavigate('home')}>
            <div className={`brand-logo-box ${isHome ? 'large' : ''}`}>
              <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo Red Comunitaria" />
            </div>
            <div>
              <div className="brand-text-title">Red Comunitaria</div>
              <div className="brand-text-sub">UNIAMAZONIA</div>
            </div>
          </div>

          {/* Enlaces: Inicio, Productos y Encuesta */}
          <nav className="nav-links">
            <button
              className={`nav-link ${active === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Inicio
            </button>
            <button
              className={`nav-link ${active === 'productos' ? 'active' : ''}`}
              onClick={() => onNavigate('productos')}
            >
              Productos
            </button>
            <button
              className={`nav-link ${active === 'encuesta' ? 'active' : ''}`}
              onClick={() => onNavigate('encuesta')}
            >
              Encuesta
            </button>
          </nav>

          <div className="nav-actions">
            {showSearch && (
              <div className="nav-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {sesionValida ? (
              <button className="btn-outline-green" onClick={() => onNavigate('admin')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Panel ({usuario})</span>
              </button>
            ) : (
              <button className="btn-outline-green" onClick={() => onNavigate('login')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>

          {/* Botón hamburguesa para pantallas móviles / tablets */}
          <button
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Menú lateral móvil (Drawer) */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="brand">
                <div className="brand-logo-box" style={{ width: '32px', height: '32px' }}>
                  <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo" />
                </div>
                <span className="brand-text-title" style={{ fontSize: '16px' }}>Red Comunitaria</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <button
              className={`drawer-item ${active === 'home' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('home'); }}
            >
              <span>🏠</span> Inicio
            </button>
            <button
              className={`drawer-item ${active === 'productos' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('productos'); }}
            >
              <span>📦</span> Productos
            </button>
            <button
              className={`drawer-item ${active === 'encuesta' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('encuesta'); }}
            >
              <span>📝</span> Encuesta de Usabilidad
            </button>
            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onNavigate(sesionValida ? 'admin' : 'login'); }}
            >
              <span>👤</span> {sesionValida ? `Panel (${usuario})` : 'Iniciar Sesión'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// TARJETA DE PRODUCTO (IDÉNTICA A LA CAPTURA DE FLUTTER)
// ============================================================================
function ProductCard({ product, onSelect, buttonColor = 'blue', showButton = true }) {
  function handleContactClick(e) {
    e.stopPropagation();
    const texto = encodeURIComponent(`Hola, me interesa el producto "${product.name}" (${product.price}) de la Red Comunitaria Uniamazonia.`);
    window.open(`https://wa.me/573100000000?text=${texto}`, '_blank');
  }

  return (
    <article className="product-card" onClick={onSelect}>
      <div className="product-card-img-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <div className="product-card-meta-row">
          <span className="product-card-cat">{product.category.toUpperCase()}</span>
          <span className={`status-badge ${product.available ? 'ok' : 'off'}`}>
            {product.available ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-price">{product.price}</div>

        {showButton && (
          <button
            type="button"
            className={`product-card-contact-btn ${buttonColor}`}
            onClick={handleContactClick}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Contactar</span>
          </button>
        )}
      </div>
    </article>
  );
}

// ============================================================================
// VISTA 1: INICIO
// ============================================================================
function HomeView({ featuredProducts, searchQuery, setSearchQuery, onExplore, onSelectProduct }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="centered hero-content">
          <h1 className="hero-title">Marketplace Comunitario Travesias</h1>
          <p className="hero-sub">
            Conectamos productores locales, estudiantes y egresados con toda la comunidad universitaria. Compra fresco, apoya lo local.
          </p>
          <div className="hero-search-row">
            <div className="hero-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Buscar productos frescos, artesanías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
              />
            </div>
            <button className="btn-blue" onClick={onExplore}>
              Explorar Productos
            </button>
          </div>
        </div>
      </section>

      <section className="centered" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 className="font-mont" style={{ fontSize: '28px', fontWeight: 700 }}>Productos Destacados</h2>
          <button
            onClick={onExplore}
            style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Ver todos los productos</span>
            <span>→</span>
          </button>
        </div>

        <div className="products-grid-home">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              buttonColor="green"
              onSelect={() => onSelectProduct(product)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================================================
// PANEL DE FILTROS REUTILIZABLE (SIDEBAR DESKTOP + MODAL MÓVIL)
// ============================================================================
function FilterPanel({ selectedCats, onToggleCat, onlyAvailable, onToggleAvailable, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  return (
    <div className="filter-panel">
      <div className="filter-title">Filtros</div>
      <div className="filter-divider"></div>

      <div className="filter-section-label">Categoría</div>
      {CATEGORIES.map(cat => {
        const checked = selectedCats.includes(cat);
        return (
          <div key={cat} className="custom-check-row" onClick={() => onToggleCat(cat)}>
            <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>
              {checked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span>{cat}</span>
          </div>
        );
      })}

      <div className="filter-divider"></div>

      <div className="filter-section-label">Disponibilidad</div>
      <div className="toggle-row">
        <span>Solo disponibles</span>
        <div
          className={`app-toggle ${onlyAvailable ? 'active' : ''}`}
          onClick={() => onToggleAvailable(!onlyAvailable)}
        >
          <div className="app-toggle-knob"></div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-section-label">Rango de precio</div>
      <div className="price-range-row">
        <input
          type="number"
          className="price-input"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span style={{ color: 'var(--muted)' }}>-</span>
        <input
          type="number"
          className="price-input"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
}

// ============================================================================
// VISTA 2: CATÁLOGO DE PRODUCTOS (IDÉNTICO A LA CAPTURA DE PANTALLA)
// ============================================================================
function ProductsView({ products, searchQuery, onSelectProduct }) {
  // Por defecto "Alimentos" seleccionado igual que en Flutter: selected = {'Alimentos'}
  const [selectedCats, setSelectedCats] = useState(['Alimentos']);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [sortBy, setSortBy] = useState('Más recientes');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function toggleCat(cat) {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  }

  const filtered = useMemo(() => {
    let list = products.slice(0, 6).concat(products.slice(6)).filter((p, idx) => {
      // Si solo está seleccionado Alimentos y no hay búsqueda, mostramos los 6 del catálogo de Alimentos
      const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchAvail = !onlyAvailable || p.available;
      const matchSearch = !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchAvail && matchSearch;
    });

    // Para coincidir con los 6 productos de "Alimentos" de la captura cuando 'Alimentos' está activo
    if (selectedCats.length === 1 && selectedCats[0] === 'Alimentos' && !searchQuery.trim()) {
      list = list.slice(0, 6);
    }

    if (sortBy === 'Nombre (A-Z)') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, selectedCats, onlyAvailable, sortBy, searchQuery]);

  const catLabel = selectedCats.length === 1 ? ` de "${selectedCats[0]}"` : '';
  const resultsText = `Mostrando ${filtered.length} productos${catLabel}`;

  return (
    <main>
      {/* Barra superior de filtros en móvil (< 900px) */}
      <div className="mobile-filter-bar">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--text)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
          </svg>
          <span>Filtrar y Ordenar</span>
        </button>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{filtered.length} productos</span>
      </div>

      <div className="centered catalog-desktop">
        <aside className="catalog-sidebar">
          <FilterPanel
            selectedCats={selectedCats}
            onToggleCat={toggleCat}
            onlyAvailable={onlyAvailable}
            onToggleAvailable={setOnlyAvailable}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        <section className="catalog-main">
          <div className="catalog-toolbar-desktop">
            <span style={{ color: 'var(--muted)', fontSize: '15px' }}>{resultsText}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Ordenar por:</span>
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Más recientes">Más recientes</option>
                <option value="Nombre (A-Z)">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--muted)', fontSize: '15px' }}>
              No hay productos con los filtros seleccionados.
            </div>
          ) : (
            <div className="products-grid-catalog">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  buttonColor="blue"
                  onSelect={() => onSelectProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Paginación circular 1, 2, 3 */}
          <div className="pagination-row">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                className={`page-circle ${page === p ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Bottom Sheet de filtros en móvil */}
      {mobileFiltersOpen && (
        <div className="modal-backdrop" onClick={() => setMobileFiltersOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <FilterPanel
              selectedCats={selectedCats}
              onToggleCat={toggleCat}
              onlyAvailable={onlyAvailable}
              onToggleAvailable={setOnlyAvailable}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0' }}>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Ordenar por:</span>
              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Más recientes">Más recientes</option>
                <option value="Nombre (A-Z)">Nombre (A-Z)</option>
              </select>
            </div>
            <button
              className="btn-green"
              style={{ width: '100%', height: '44px' }}
              onClick={() => setMobileFiltersOpen(false)}
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================================================
// VISTA 3: DETALLE DE PRODUCTO
// ============================================================================
function DetailView({ product, relatedProducts, onBack, onSelectProduct }) {
  function contactarWhatsapp() {
    const texto = encodeURIComponent(`Hola, me interesa el producto "${product.name}" (${product.price}) que vi en la Red Comunitaria Uniamazonia.`);
    window.open(`https://wa.me/573100000000?text=${texto}`, '_blank');
  }

  return (
    <main className="centered" style={{ paddingTop: '32px', paddingBottom: '56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--muted)' }}>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>Productos</span>
        <span>›</span>
        <span>{product.category}</span>
        <span>›</span>
        <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</strong>
      </div>

      <div className="detail-layout">
        <div>
          <img className="detail-img" src={product.imageUrl} alt={product.name} />
        </div>

        <div className="detail-panel">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ background: 'var(--tag-bg)', color: 'var(--blue)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              {product.category}
            </span>
            <span className={`status-badge ${product.available ? 'ok' : 'off'}`}>
              {product.available ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <h1 style={{ fontSize: '30px', marginBottom: '20px' }}>{product.name}</h1>

          <div style={{ marginBottom: '20px' }}>
            <span className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>
              {product.price}
            </span>
            {product.unit && (
              <span className="font-mont" style={{ color: 'var(--muted)', fontSize: '16px', marginLeft: '6px' }}>
                {product.unit}
              </span>
            )}
          </div>

          <div className="filter-divider" style={{ margin: '20px 0' }}></div>

          <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Descripción</h4>
          <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '24px' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <strong className="font-mont" style={{ fontSize: '14px' }}>Presentación:</strong>
            <span style={{ padding: '6px 12px', background: 'var(--bg)', border: '1px solid var(--green)', borderRadius: '6px', color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>
              {product.presentation || 'Frasco de Vidrio 500ml'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-blue" style={{ flex: 1, height: '48px' }} onClick={contactarWhatsapp}>
              💬 Contactar por WhatsApp
            </button>
            <button className="btn-outline-grey" style={{ height: '48px' }} onClick={onBack}>
              Volver
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Productos Relacionados</h3>
      <div className="products-grid-catalog">
        {relatedProducts.map(rel => (
          <ProductCard
            key={rel.id}
            product={rel}
            onSelect={() => onSelectProduct(rel)}
          />
        ))}
      </div>
    </main>
  );
}

// ============================================================================
// VISTA ENCUESTA DE USABILIDAD (ESTANDARIZADA TRAVESÍAS V2 CON CARITAS)
// ============================================================================
function EncuestaUsabilidadView({ subproyectoId, nombreSubproyecto, token, usuario, sesionValida, onIrLogin, onCancelar }) {
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [error, setError] = useState(null);

  const completadas = Object.keys(respuestas).length;

  function seleccionarOpcion(numeroPregunta, valor) {
    if (enviando) return;
    setRespuestas(prev => ({ ...prev, [numeroPregunta]: valor }));
    setError(null);
  }

  async function handleEnviar() {
    if (enviando || enviada || completadas !== 5) return;

    const tokenActual = token || sessionStorage.getItem('access_token') || sessionStorage.getItem('token');
    if (!tokenActual) {
      setError('Tu sesión no está disponible. Inicia sesión en el portal central para enviar tu encuesta.');
      return;
    }

    setEnviando(true);
    setError(null);

    const payload = {
      subproyecto_id: subproyectoId,
      version_encuesta: 2,
      respuestas: {
        respuesta_1: respuestas[1],
        respuesta_2: respuestas[2],
        respuesta_3: respuestas[3],
        respuesta_4: respuestas[4],
        respuesta_5: respuestas[5]
      }
    };

    try {
      const res = await fetch(`${AUTH_API_URL}/api/v1/encuestas/usabilidad`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenActual}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 200 || res.status === 201) {
        setEnviada(true);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setError('Tu sesión expiró. Inicia sesión nuevamente en el portal central.');
      } else if (res.status === 403) {
        setError('No tienes acceso a este subproyecto.');
      } else if (res.status === 409) {
        setError('Ya respondiste esta versión de la encuesta en este subproyecto.');
      } else if (res.status === 422) {
        setError('Las respuestas enviadas no son válidas.');
      } else {
        setError(data.detail || 'No se pudieron guardar tus respuestas. Inténtalo más tarde.');
      }
    } catch (e) {
      setError('No fue posible conectar con el servidor de encuestas (Puerto 8000).');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ backgroundColor: '#F8F9FA', flex: 1, padding: '24px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Barra de Identidad Institucional extraída del módulo */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          border: '1px solid #DEE2E6',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px'
        }}>
          <img src="assets/images/escudo_uniamazonia.png" alt="Universidad de la Amazonia" style={{ height: '60px', width: '77px', objectFit: 'contain' }} />
          <img src="assets/images/logo_sistemas.png" alt="Programa de Ingeniería de Sistemas" style={{ height: '60px', width: '145px', objectFit: 'contain' }} />
          <img src="assets/images/logo_red_comunitaria.jpg" alt="Red Comunitaria Uniamazonia" style={{ height: '60px', width: '62px', objectFit: 'contain' }} />
        </div>

        {enviada ? (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px 24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid #DEE2E6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '54px', color: '#007A33', marginBottom: '12px' }}>✓</div>
            <h2 className="font-mont" style={{ fontSize: '24px', fontWeight: 700, color: '#212529', marginBottom: '8px' }}>
              ¡Gracias por tu opinión!
            </h2>
            <p style={{ fontSize: '16px', color: '#212529', marginBottom: '24px' }}>
              Tu encuesta se guardó correctamente en el subproyecto correspondiente.
            </p>
            <button className="btn-outline-green" onClick={onCancelar} style={{ height: '48px', padding: '0 20px' }}>
              ← Volver al subproyecto
            </button>
          </div>
        ) : (
          <div>
            <h1 className="font-mont" style={{ fontSize: '24px', fontWeight: 700, color: '#212529', marginBottom: '8px' }}>
              Encuesta de usabilidad
            </h1>
            <p style={{ fontSize: '16px', color: '#212529', marginBottom: '12px' }}>
              Cuéntanos cómo fue tu experiencia. Elige una carita por afirmación.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#212529', flexWrap: 'wrap' }}>
              <span style={{ color: '#0085CA', fontWeight: 700 }}>❖</span>
              <span>Subproyecto: <strong>{nombreSubproyecto || subproyectoId}</strong></span>
              {sesionValida && usuario && (
                <span style={{ marginLeft: 'auto', background: '#E2F2E8', color: '#007A33', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                  Sesión activa: {usuario}
                </span>
              )}
            </div>

            {!sesionValida && (
              <div style={{
                background: '#FFF3CD',
                border: '1px solid #FFECB5',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: '14px', color: '#664D03' }}>
                  Para registrar tu respuesta en la base de datos necesitas tener sesión iniciada en el Portal Central.
                </span>
                <button className="btn-green" onClick={onIrLogin} style={{ padding: '8px 14px', fontSize: '13px' }}>
                  Iniciar sesión
                </button>
              </div>
            )}

            {/* Tarjeta de progreso */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #DEE2E6',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="font-mont" style={{ fontSize: '14px', fontWeight: 600 }}>Tu progreso</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{completadas} de 5</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#E4EEE7', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{
                  width: `${(completadas / 5) * 100}%`,
                  height: '100%',
                  background: '#007A33',
                  transition: 'width 0.2s ease'
                }} />
              </div>
              <div style={{ fontSize: '14px', color: '#212529' }}>
                Evaluación: 😡 Malo  ·  😬 Medio  ·  🤩 Excelente
              </div>
            </div>

            {/* 5 Preguntas Oficiales */}
            {PREGUNTAS_ENCUESTA.map(pregunta => {
              const marcada = respuestas[pregunta.numero];
              const opcionMarcada = OPCIONES_EVALUACION.find(o => o.valor === marcada);

              return (
                <div
                  key={pregunta.numero}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    border: '1px solid #DEE2E6',
                    marginBottom: '12px'
                  }}
                >
                  <div className="font-mont" style={{ fontSize: '16px', fontWeight: 600, color: '#212529', marginBottom: '16px' }}>
                    {pregunta.numero}. {pregunta.texto}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {OPCIONES_EVALUACION.map(opcion => {
                      const isSelected = marcada === opcion.valor;
                      return (
                        <button
                          key={opcion.valor}
                          type="button"
                          onClick={() => seleccionarOpcion(pregunta.numero, opcion.valor)}
                          disabled={enviando}
                          style={{
                            background: isSelected ? '#E2F2E8' : '#FFFFFF',
                            border: isSelected ? '2px solid #007A33' : '1px solid #DEE2E6',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            cursor: enviando ? 'wait' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '92px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '30px', lineHeight: 1.1 }}>{opcion.emoji}</span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#212529', marginTop: '6px' }}>
                            {opcion.etiqueta}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {opcionMarcada && (
                    <div style={{ marginTop: '12px', fontSize: '14px', color: '#007A33', fontWeight: 500 }}>
                      Tu elección: {opcionMarcada.emoji} {opcionMarcada.etiqueta}
                    </div>
                  )}
                </div>
              );
            })}

            {error && (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #E20613',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#E20613',
                fontSize: '14px'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <p style={{ fontSize: '14px', color: '#6C757D', marginTop: '8px', marginBottom: '16px' }}>
              Las respuestas se asociarán a este subproyecto y a tu cuenta del inicio de sesión único. No solicitamos datos personales adicionales.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <button
                type="button"
                className="btn-outline-green"
                style={{ height: '48px', padding: '0 20px' }}
                onClick={onCancelar}
                disabled={enviando}
              >
                ← Regresar
              </button>
              <button
                type="button"
                className="btn-green"
                style={{
                  height: '48px',
                  padding: '0 20px',
                  opacity: (enviando || completadas !== 5) ? 0.6 : 1,
                  cursor: (enviando || completadas !== 5) ? 'not-allowed' : 'pointer'
                }}
                disabled={enviando || completadas !== 5}
                onClick={handleEnviar}
              >
                {enviando ? 'Enviando...' : '📩 Enviar respuestas'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================================
// VISTA 4: PANEL ADMINISTRATIVO DE PRODUCTORES
// ============================================================================
function AdminView({ mode, usuario, products, onNavigate, onDelete, onSaveProduct, onVolverDashboard, onCerrarSesion }) {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentos');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const filtered = products.filter(p => {
    const okQ = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase());
    const okC = catFilter === 'Todas' || p.category === catFilter;
    const okS = statusFilter === 'Todos' || (statusFilter === 'Disponible' ? p.available : !p.available);
    return okQ && okC && okS;
  });

  function submitForm(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProduct({
      name: name.trim(),
      category,
      price: price.trim().startsWith('$') ? price.trim() : `$ ${price.trim() || '10.000'}`,
      description: description.trim(),
      available,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    });
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
  }

  return (
    <div>
      <header className="admin-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-logo-box" style={{ width: '38px', height: '38px' }}>
            <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo" />
          </div>
          <span className="font-mont" style={{ fontSize: '16px', fontWeight: 700 }}>
            Panel Administrativo
          </span>
        </div>

        <span style={{ background: 'var(--admin-badge)', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
          {usuario}
        </span>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className={`admin-nav-btn ${mode === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            📦 Productos
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminNuevo' ? 'active' : ''}`}
            onClick={() => onNavigate('adminNuevo')}
          >
            ➕ Nuevo Producto
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminEncuestas' ? 'active' : ''}`}
            onClick={() => onNavigate('adminEncuestas')}
          >
            📊 Resultados Encuesta
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('encuesta')}>
            📝 Ver Encuesta
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('home')}>
            🏪 Ver Catálogo
          </button>
          <button className="admin-nav-btn" onClick={onVolverDashboard}>
            ⬅️ Dashboard Central
          </button>
          <button
            className="admin-nav-btn"
            style={{ color: 'var(--danger)' }}
            onClick={onCerrarSesion}
          >
            🚪 Cerrar Sesión
          </button>
        </aside>

        <main className="admin-main">
          {mode === 'admin' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', marginBottom: '4px' }}>Gestión de Productos</h1>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    Administra el inventario, precios y disponibilidad de la Red Comunitaria
                  </p>
                </div>
                <button className="btn-green" onClick={() => onNavigate('adminNuevo')}>
                  + Agregar Producto
                </button>
              </div>

              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 2, minWidth: '200px' }}
                  placeholder="Buscar por nombre..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  className="sort-dropdown"
                  style={{ flex: 1, minWidth: '150px' }}
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                >
                  <option value="Todas">Todas las Categorías</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  className="sort-dropdown"
                  style={{ flex: 1, minWidth: '150px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Todos">Disponibilidad</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Disponibilidad</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        </td>
                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                        <td style={{ color: 'var(--muted)' }}>{p.category}</td>
                        <td className="font-mont" style={{ fontWeight: 600, color: 'var(--green)' }}>
                          {p.price}
                        </td>
                        <td>
                          <span className={`status-badge ${p.available ? 'ok' : 'off'}`}>
                            {p.available ? 'Disponible' : 'Agotado'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => onDelete(p.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '16px' }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : mode === 'adminNuevo' ? (
            <div>
              <h1 style={{ fontSize: '26px', marginBottom: '4px' }}>Registrar Nuevo Producto</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
                Completa los campos para publicar un nuevo producto en el catálogo institucional
              </p>

              <form
                onSubmit={submitForm}
                style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', maxWidth: '760px' }}
              >
                <div className="form-field">
                  <label>Nombre del producto</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Queso Campesino Criollo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Descripción</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe los ingredientes, origen y características del producto..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-field">
                    <label>Categoría</label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Precio sugerido</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej. $ 15.000 / kg"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>URL de Imagen (opcional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="btn-outline-grey" onClick={() => onNavigate('admin')}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-green">
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <AdminEncuestasPanel subproyectoId={SUBPROYECTO_ID} onNavigate={onNavigate} />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// PANEL DE RESULTADOS DE ENCUESTAS (PROMEDIOS Y REGISTROS EN BD LOCAL)
// ============================================================================
function AdminEncuestasPanel({ subproyectoId, onNavigate }) {
  const [datos, setDatos] = useState({ resumen: [], respuestas: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${AUTH_API_URL}/api/v1/encuestas/usabilidad/resumen?subproyecto_id=${encodeURIComponent(subproyectoId)}`);
      if (!res.ok) throw new Error('Error consultando resultados de encuestas.');
      const json = await res.json();
      setDatos(json);
    } catch (e) {
      setError('No se pudo conectar con la API de encuestas en el puerto 8000.');
    } finally {
      setCargando(false);
    }
  }

  function emojiPorValor(v) {
    if (v === 1) return '😡 Malo (1)';
    if (v === 2) return '😬 Medio (2)';
    if (v === 3) return '🤩 Excelente (3)';
    return v;
  }

  const resumenActual = datos.resumen && datos.resumen.length > 0 ? datos.resumen[0] : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', marginBottom: '4px' }}>Resultados Encuesta de Usabilidad</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Subproyecto: <strong>{subproyectoId}</strong> · Escala V2 (1 = 😡 Malo, 2 = 😬 Medio, 3 = 🤩 Excelente)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline-green" onClick={cargarResumen}>
            🔄 Actualizar
          </button>
          <button className="btn-green" onClick={() => onNavigate('encuesta')}>
            📝 Responder Encuesta
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={{ padding: '32px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
          Cargando resultados de la base de datos...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #E20613', color: '#E20613' }}>
          {error}
        </div>
      ) : (
        <>
          {resumenActual ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>TOTAL RESPUESTAS</div>
                <div className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)', marginTop: '6px' }}>
                  {resumenActual.numero_respuestas}
                </div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>PROMEDIO GENERAL (1-3)</div>
                <div className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--blue)', marginTop: '6px' }}>
                  {resumenActual.promedio_usabilidad} / 3.0
                </div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P1. APRENDIZAJE</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.aprendizaje}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P2. NAVEGACIÓN</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.navegacion}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P3. CLARIDAD</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.claridad}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P4. EFICIENCIA / P5. SATISFACCIÓN</div>
                <div className="font-mont" style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}>
                  {resumenActual.eficiencia_percibida} · {resumenActual.satisfaccion}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px', color: 'var(--muted)' }}>
              Aún no hay respuestas registradas para este subproyecto.
            </div>
          )}

          {datos.respuestas && datos.respuestas.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Versión</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>P4</th>
                    <th>P5</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.respuestas.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td style={{ fontWeight: 600 }}>{r.usuario_id}</td>
                      <td>v{r.version_encuesta}</td>
                      <td>{emojiPorValor(r.respuesta_1)}</td>
                      <td>{emojiPorValor(r.respuesta_2)}</td>
                      <td>{emojiPorValor(r.respuesta_3)}</td>
                      <td>{emojiPorValor(r.respuesta_4)}</td>
                      <td>{emojiPorValor(r.respuesta_5)}</td>
                      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{r.fecha_creacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// PIE DE PÁGINA INSTITUCIONAL
// ============================================================================
function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="centered">
        <div className="footer-top">
          <div style={{ maxWidth: '456px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Red Comunitaria Uniamazonia</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Una iniciativa institucional para fomentar la economía solidaria y visibilizar el trabajo de nuestra comunidad universitaria.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div className="footer-col">
              <h4>Enlaces</h4>
              <ul>
                <li><button onClick={() => onNavigate('home')}>Inicio</button></li>
                <li><button onClick={() => onNavigate('productos')}>Productos</button></li>
                <li><button onClick={() => onNavigate('encuesta')}>Encuesta de Usabilidad</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Soporte</h4>
              <ul>
                <li><button onClick={() => onNavigate('home')}>Preguntas Frecuentes</button></li>
                <li><button onClick={() => onNavigate('home')}>Contacto</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-logos">
          <div className="footer-logo-card">
            <img src="assets/images/escudo_uniamazonia.png" alt="Universidad de la Amazonia" />
          </div>
          <div className="footer-logo-card">
            <img src="assets/images/logo_sistemas.png" alt="Ingeniería de Sistemas" />
          </div>
        </div>

        <div className="footer-copy">
          © 2026 Red Comunitaria Uniamazonia. Todos los derechos reservados. Universidad de la Amazonia.
        </div>
      </div>
    </footer>
  );
}

function WhatsappFab() {
  return (
    <button
      className="whatsapp-fab"
      title="Contactar por WhatsApp"
      onClick={() => window.open('https://wa.me/573100000000', '_blank')}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
