// ============================================================================
// VISTA 4: PANEL DE GESTIÓN Y AGREGAR PRODUCTO
// ============================================================================
function AdminView({ mode, products, usuario, onNavigate, onDelete, onSaveProduct, onVolverDashboard, onCerrarSesion }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <div className="brand-logo-box" style={{ width: '38px', height: '38px' }}>
            <img src="assets/images/logo_red_comunitaria.jpg" alt="Logo" />
          </div>
          <span className="font-mont" style={{ fontSize: '16px', fontWeight: 700 }}>
            Despensa Digital · Gestión
          </span>
        </div>

        <span style={{ background: 'var(--admin-badge)', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
          {usuario ? `Usuario: ${usuario}` : 'Comunidad Uniamazonia'}
        </span>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button
            className={`admin-nav-btn ${mode === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            📦 Lista de Productos
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminNuevo' ? 'active' : ''}`}
            onClick={() => onNavigate('adminNuevo')}
          >
            ➕ Agregar Producto
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('productos')}>
            🏪 Ver Catálogo
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminEncuestas' ? 'active' : ''}`}
            onClick={() => onNavigate('adminEncuestas')}
          >
            📊 Resultados Encuesta
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('encuesta')}>
            📝 Ir a Encuesta
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('home')}>
            🏠 Ir a Inicio
          </button>

          <div style={{ height: '1px', background: 'var(--border)', margin: '14px 0' }}></div>

          <button className="admin-nav-btn" onClick={onVolverDashboard}>
            🔲 Volver al panel
          </button>
          <button className="admin-nav-btn" onClick={onCerrarSesion} style={{ color: 'var(--danger)', fontWeight: 600 }}>
            🚪 Cerrar sesión
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
                  <button type="button" className="btn-outline-grey" onClick={() => onNavigate('productos')}>
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
