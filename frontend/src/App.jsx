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

  // 2. Método de validación y carga de productos desde la API (MySQL despensa)
  useEffect(() => {
    validarYCargarSesion();
    cargarProductosDesdeAPI();
  }, []);

  async function cargarProductosDesdeAPI() {
    try {
      const resp = await fetch(`${AUTH_API_URL}/api/productos`);
      if (resp.ok) {
        const datos = await resp.json();
        if (Array.isArray(datos) && datos.length > 0) {
          setCatalogProducts(datos);
        }
      }
    } catch (e) {
      console.warn('Conexión backend no disponible, usando catálogo local:', e);
    }
  }

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

  function volverAlDashboard() {
    window.location.href = 'http://100.79.246.82:8081/dashboard.html';
  }

  function cerrarSesion() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('nombre_usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.clear();

    setUsuarioFinal(null);
    setTokenFinal(null);
    setSesionValida(false);

    window.location.replace('http://100.79.246.82:8081/index.html?logout=true');
  }

  function handleOpenDetail(product) {
    setSelectedProduct(product);
    setView('detalle');
    window.scrollTo(0, 0);
  }

  function handleNavigate(targetView) {
    setView(targetView);
    window.scrollTo(0, 0);
  }

  async function handleAddProduct(newProd) {
    const tempId = Date.now();
    const created = {
      ...newProd,
      id: tempId
    };
    setCatalogProducts(prev => [created, ...prev]);
    setView('home');
    window.scrollTo(0, 0);

    try {
      const resp = await fetch(`${AUTH_API_URL}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (resp.ok) {
        const guardado = await resp.json();
        setCatalogProducts(prev => prev.map(p => p.id === tempId ? { ...p, ...guardado, id: guardado.id } : p));
      }
    } catch (e) {
      console.warn('Producto guardado localmente, sincronización remota pendiente:', e);
    }
  }

  async function handleDeleteProduct(id) {
    if (window.confirm('¿Eliminar este producto de la lista?')) {
      setCatalogProducts(prev => prev.filter(p => p.id !== id));
      try {
        await fetch(`${AUTH_API_URL}/api/productos/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Error al eliminar en backend:', e);
      }
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
            usuario={usuarioFinal}
            onVolverDashboard={volverAlDashboard}
            onCerrarSesion={cerrarSesion}
          />
          <HomeView
            products={catalogProducts}
            onSelectProduct={handleOpenDetail}
          />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {view === 'productos' && (
        <>
          <PublicNavbar
            active="productos"
            onNavigate={handleNavigate}
            usuario={usuarioFinal}
            onVolverDashboard={volverAlDashboard}
            onCerrarSesion={cerrarSesion}
          />
          <ProductsView
            onSaveProduct={handleAddProduct}
            onNavigate={handleNavigate}
          />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {view === 'detalle' && (
        <>
          <PublicNavbar
            active="home"
            onNavigate={handleNavigate}
            usuario={usuarioFinal}
            onVolverDashboard={volverAlDashboard}
            onCerrarSesion={cerrarSesion}
          />
          <DetailView
            product={selectedProduct}
            relatedProducts={FEATURED_PRODUCTS.slice(0, 3)}
            onBack={() => handleNavigate('home')}
            onSelectProduct={handleOpenDetail}
          />
        </>
      )}

      {view === 'encuesta' && (
        <>
          <PublicNavbar
            active="encuesta"
            onNavigate={handleNavigate}
            usuario={usuarioFinal}
            onVolverDashboard={volverAlDashboard}
            onCerrarSesion={cerrarSesion}
          />
          <EncuestaUsabilidadView
            subproyectoId={SUBPROYECTO_ID}
            nombreSubproyecto={SUBPROYECTO_NOMBRE}
            onCancelar={() => handleNavigate('home')}
          />
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {view === 'adminEncuestas' && (
        <>
          <PublicNavbar
            active="adminEncuestas"
            onNavigate={handleNavigate}
            usuario={usuarioFinal}
            onVolverDashboard={volverAlDashboard}
            onCerrarSesion={cerrarSesion}
          />
          <main className="centered" style={{ flex: 1, paddingTop: '40px', paddingBottom: '64px' }}>
            <AdminEncuestasPanel subproyectoId={SUBPROYECTO_ID} onNavigate={handleNavigate} />
          </main>
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {(view === 'admin' || view === 'adminNuevo') && (
        <AdminView
          mode={view}
          products={catalogProducts}
          usuario={usuarioFinal}
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

Object.assign(window, { App });
