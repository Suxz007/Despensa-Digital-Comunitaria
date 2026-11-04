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

function PublicNavbar({
  active,
  isHome,
  onNavigate,
  usuario,
  onVolverDashboard,
  onCerrarSesion
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className={`navbar ${isHome ? 'home-nav' : ''}`}>
        <div className="navbar-inner">
          <div className="brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
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
            <button
              className="btn-outline-grey"
              onClick={onVolverDashboard}
              title="Volver al panel central de Travesías"
              style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Volver al panel</span>
            </button>

            <button
              className="btn-outline-grey"
              onClick={onCerrarSesion}
              title={usuario ? `Cerrar sesión de ${usuario}` : 'Cerrar sesión'}
              style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#d32f2f', borderColor: '#f5c2c7' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>

          {/* Botón hamburguesa para abrir el menú lateral Travesías */}
          <button
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Menú lateral móvil (Drawer) idéntico a la plantilla oficial de Travesías */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '12px' }}>
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="brand-logo-box" style={{ width: '38px', height: '38px' }}>
                  <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo" />
                </div>
                <div>
                  <div className="brand-text-title" style={{ fontSize: '16px', fontWeight: 700 }}>Despensa Digital</div>
                  <div className="brand-text-sub" style={{ fontSize: '12px', color: 'var(--muted)' }}>Red Comunitaria Travesías</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            <button
              className={`drawer-item ${active === 'home' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('home'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Inicio</span>
            </button>

            <button
              className={`drawer-item ${active === 'productos' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('productos'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Ver catálogo de productos</span>
            </button>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onNavigate('adminNuevo'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Agregar un producto</span>
            </button>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onNavigate('admin'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Gestión de inventario</span>
            </button>

            <button
              className={`drawer-item ${active === 'encuesta' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('encuesta'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <span>Encuesta de Travesías</span>
            </button>

            <div style={{ height: '1px', background: 'var(--border)', margin: '14px 0' }}></div>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onVolverDashboard && onVolverDashboard(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Volver al panel</span>
            </button>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onCerrarSesion && onCerrarSesion(); }}
              style={{ color: '#d32f2f', fontWeight: 600 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '10px' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
