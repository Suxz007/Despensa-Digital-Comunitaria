// ============================================================================
// VISTA 1: INICIO (SOLO PRODUCTOS CON PAGINACIÓN 1, 2, 3)
// ============================================================================
function HomeView({ products = [], onSelectProduct }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Combinar productos recibidos con el catálogo completo si el backend devolvió pocos
  const fullList = useMemo(() => {
    const base = Array.isArray(products) && products.length > 0 ? products : INITIAL_CATALOG_PRODUCTS;
    if (base.length >= 12) return base;
    const ids = new Set(base.map(p => p.id));
    const extras = INITIAL_CATALOG_PRODUCTS.filter(p => !ids.has(p.id));
    return [...base, ...extras];
  }, [products]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return fullList.slice(start, start + itemsPerPage);
  }, [fullList, page]);

  function handlePageChange(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main style={{ flex: 1 }}>
      <section className="centered" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <div className="products-grid-home">
          {paginatedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              buttonColor="green"
              onSelect={() => onSelectProduct(product)}
            />
          ))}
        </div>

        {/* Paginación circular 1, 2, 3 para cambiar los productos */}
        <div className="pagination-row" style={{ marginTop: '36px' }}>
          {[1, 2, 3].map(p => (
            <button
              key={p}
              className={`page-circle ${page === p ? 'active' : ''}`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { HomeView });
