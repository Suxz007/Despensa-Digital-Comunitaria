// ============================================================================
// VISTA 1: INICIO (6 PRODUCTOS POR PÁGINA, PAGINACIÓN DINÁMICA Y EDICIÓN)
// ============================================================================
function HomeView({ products = [], onSelectProduct, onUpdateProduct, onDeleteProduct, onNavigate }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Estado para el modal de Modificar Producto
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Alimentos');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageFileName, setEditImageFileName] = useState('');

  const safeProducts = Array.isArray(products) ? products : [];

  // Cálculo automático de páginas en bloques de 6 (manteniendo mínimo 3 visibles para inventario futuro)
  const totalPages = useMemo(() => {
    const calculated = Math.ceil(safeProducts.length / itemsPerPage);
    return Math.max(3, calculated);
  }, [safeProducts.length]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }, [totalPages]);

  // Ajustar página activa si se eliminan productos y la página queda fuera de rango
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return safeProducts.slice(start, start + itemsPerPage);
  }, [safeProducts, page]);

  function handlePageChange(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditCategory(product.category || 'Alimentos');
    setEditPrice(product.price || '');
    setEditDescription(product.description || '');
    setEditAvailable(product.available !== false);
    setEditImageUrl(product.imageUrl || '');
    setEditImageFileName('');
  }

  function closeEditModal() {
    setEditingProduct(null);
    setEditImageFileName('');
  }

  function handleEditImageFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setEditImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setEditImageUrl(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function submitEditForm(e) {
    e.preventDefault();
    if (!editingProduct || !editName.trim()) return;

    const formattedPrice = editPrice.trim().startsWith('$')
      ? editPrice.trim()
      : `$ ${editPrice.trim() || '10.000'}`;

    const updated = {
      ...editingProduct,
      name: editName.trim(),
      category: editCategory,
      price: formattedPrice,
      description: editDescription.trim(),
      available: editAvailable,
      imageUrl: editImageUrl.trim() || DEFAULT_PRODUCT_IMAGE
    };

    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    closeEditModal();
  }

  return (
    <main style={{ flex: 1 }}>
      <section className="centered" style={{ paddingTop: '36px', paddingBottom: '56px' }}>
        <div className="products-grid-home">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                buttonColor="green"
                onSelect={() => onSelectProduct(product)}
                onEdit={openEditModal}
                onDelete={onDeleteProduct}
              />
            ))
          ) : (
            <div className="empty-page-box">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.6" style={{ marginBottom: '12px' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <h3 className="font-mont" style={{ fontSize: '18px', color: 'var(--text)', marginBottom: '6px' }}>
                Página {page} lista para nuevo inventario
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '420px', marginBottom: '18px' }}>
                Aún no hay productos registrados en este bloque del catálogo. Puedes agregar nuevos productos para que aparezcan aquí automáticamente.
              </p>
              {onNavigate && (
                <button
                  type="button"
                  className="btn-green"
                  onClick={() => onNavigate('productos')}
                >
                  + Registrar Nuevo Producto
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginación dinámica calculada en bloques de 6 productos */}
        <div className="pagination-row" style={{ marginTop: '36px' }}>
          {pageNumbers.map(p => (
            <button
              key={p}
              className={`page-circle ${page === p ? 'active' : ''}`}
              onClick={() => handlePageChange(p)}
              title={`Ir a la página ${p}`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Modal para Modificar Producto */}
      {editingProduct && (
        <div
          className="modal-backdrop"
          style={{ alignItems: 'center', padding: '16px' }}
          onClick={closeEditModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '28px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              border: '1px solid var(--border)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 className="font-mont" style={{ fontSize: '20px', color: 'var(--text)' }}>
                Modificar Producto
              </h2>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitEditForm}>
              <div className="form-field">
                <label>Nombre del producto</label>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Descripción</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                <div className="form-field">
                  <label>Categoría</label>
                  <select
                    className="form-input"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-field">
                  <label>Precio</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Estado</label>
                  <select
                    className="form-input"
                    value={editAvailable ? 'Disponible' : 'Agotado'}
                    onChange={e => setEditAvailable(e.target.value === 'Disponible')}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Foto del producto</label>
                <div style={{
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  background: '#FAFAFA'
                }}>
                  {editImageUrl && (
                    <div style={{ width: '160px', height: '110px', margin: '0 auto 10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img
                        src={editImageUrl}
                        alt="Vista previa"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMAGE; }}
                      />
                    </div>
                  )}
                  <label
                    htmlFor="edit-foto-input"
                    style={{
                      cursor: 'pointer',
                      display: 'inline-block',
                      background: 'var(--blue)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    📁 Cambiar foto desde archivo
                  </label>
                  {editImageFileName && (
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                      {editImageFileName}
                    </div>
                  )}
                  <input
                    id="edit-foto-input"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageFile}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-outline-grey" onClick={closeEditModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-green">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

Object.assign(window, { HomeView });
