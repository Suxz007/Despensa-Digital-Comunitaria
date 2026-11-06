// ============================================================================
// COMPONENTES DE NAVEGACIÓN (CON SOPORTE RESPONSIVE DESKTOP + DRAWER MÓVIL)
// ============================================================================
function TopBanner() {
  return null;
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
              style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', borderColor: '#f5c2c7' }}
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

      {/* Menú lateral desplegable a la derecha (Drawer) */}
      {drawerOpen && (
        <div
          className="drawer-backdrop"
          style={{ justifyContent: 'flex-end' }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="drawer-panel"
            style={{ marginLeft: 'auto', boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="brand-logo-box" style={{ width: '36px', height: '36px' }}>
                  <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo" />
                </div>
                <div>
                  <div className="brand-text-title" style={{ fontSize: '15px', fontWeight: 700 }}>Despensa Digital</div>
                  <div className="brand-text-sub" style={{ fontSize: '11px', color: 'var(--muted)' }}>Red Comunitaria Travesías</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            <button
              className={`drawer-item ${active === 'home' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('home'); }}
            >
              <span>🏠</span>
              <span>Ir a Inicio</span>
            </button>

            <button
              className={`drawer-item ${active === 'productos' || active === 'adminNuevo' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('productos'); }}
            >
              <span>➕</span>
              <span>Agregar Producto</span>
            </button>

            <button
              className={`drawer-item ${active === 'encuesta' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('encuesta'); }}
            >
              <span>📝</span>
              <span>Ir a Encuesta</span>
            </button>

            <button
              className={`drawer-item ${active === 'adminEncuestas' ? 'active' : ''}`}
              onClick={() => { setDrawerOpen(false); onNavigate('adminEncuestas'); }}
            >
              <span>📊</span>
              <span>Resultados Encuesta</span>
            </button>

            <div style={{ height: '1px', background: 'var(--border)', margin: '14px 0' }}></div>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onVolverDashboard && onVolverDashboard(); }}
            >
              <span>🔲</span>
              <span>Volver al panel</span>
            </button>

            <button
              className="drawer-item"
              onClick={() => { setDrawerOpen(false); onCerrarSesion && onCerrarSesion(); }}
              style={{ color: 'var(--danger)', fontWeight: 600 }}
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { TopBanner, PublicNavbar });
