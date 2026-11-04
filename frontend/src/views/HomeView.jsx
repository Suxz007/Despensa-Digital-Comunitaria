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

Object.assign(window, { HomeView });
