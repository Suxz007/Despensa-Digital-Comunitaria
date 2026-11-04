// ============================================================================
// VISTA 2: MÓDULO PRODUCTOS (REGISTRAR NUEVO PRODUCTO)
// ============================================================================
function ProductsView({ onSaveProduct, onNavigate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentos');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  function submitForm(e) {
    e.preventDefault();
    if (!name.trim()) return;
    if (onSaveProduct) {
      onSaveProduct({
        name: name.trim(),
        category,
        price: price.trim().startsWith('$') ? price.trim() : `$ ${price.trim() || '10.000'}`,
        description: description.trim(),
        available: true,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
      });
    }
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
  }

  return (
    <main className="centered" style={{ flex: 1, paddingTop: '40px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h1 className="font-mont" style={{ fontSize: '26px', marginBottom: '6px', color: 'var(--text)' }}>
          Registrar Nuevo Producto
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          Completa los campos para publicar un nuevo producto en el catálogo institucional
        </p>

        <form
          onSubmit={submitForm}
          style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
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
            <button type="button" className="btn-outline-grey" onClick={() => onNavigate && onNavigate('home')}>
              Cancelar
            </button>
            <button type="submit" className="btn-green">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

Object.assign(window, { ProductsView });
