// ============================================================================
// VISTA 2: CATÁLOGO DE PRODUCTOS (IDÉNTICO A LA CAPTURA DE PANTALLA)
// ============================================================================
function ProductsView({ products, searchQuery, onSelectProduct, onNavigate }) {
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
        <button
          className="btn-green"
          onClick={() => onNavigate && onNavigate('adminNuevo')}
          style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <span>+ Agregar Producto</span>
        </button>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                className="btn-green"
                onClick={() => onNavigate && onNavigate('adminNuevo')}
                style={{ height: '38px', padding: '0 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>+ Agregar Producto</span>
              </button>
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

Object.assign(window, { ProductsView });
