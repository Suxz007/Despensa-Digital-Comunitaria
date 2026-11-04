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
  const [imageFileName, setImageFileName] = useState('');

  function handleImageFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setImageFileName(file.name);

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
        setImageUrl(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function eliminarImagen() {
    setImageUrl('');
    setImageFileName('');
  }

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
    setImageFileName('');
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
            className="admin-nav-btn"
            onClick={() => onNavigate('home')}
          >
            🏠 Ir a Inicio
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminNuevo' ? 'active' : ''}`}
            onClick={() => onNavigate('productos')}
          >
            ➕ Agregar Producto
          </button>
          <button className="admin-nav-btn" onClick={() => onNavigate('encuesta')}>
            📝 Ir a Encuesta
          </button>
          <button
            className={`admin-nav-btn ${mode === 'adminEncuestas' ? 'active' : ''}`}
            onClick={() => onNavigate('adminEncuestas')}
          >
            📊 Resultados Encuesta
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
                  <label>Foto del producto</label>
                  <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#FAFAFA',
                    position: 'relative'
                  }}>
                    {!imageUrl ? (
                      <div>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.6" style={{ margin: '0 auto 8px', display: 'block' }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <label
                          htmlFor="admin-foto-input"
                          style={{
                            cursor: 'pointer',
                            display: 'inline-block',
                            background: 'var(--green)',
                            color: '#fff',
                            padding: '8px 18px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: '6px'
                          }}
                        >
                          📁 Seleccionar imagen de archivo
                        </label>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                          Acepta JPG, PNG, WEBP. Se ajusta automáticamente al tamaño del contenedor.
                        </p>
                        <input
                          id="admin-foto-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '100%',
                          maxWidth: '300px',
                          height: '190px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid var(--border)'
                        }}>
                          <img
                            src={imageUrl}
                            alt="Vista previa"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            {imageFileName || 'Foto cargada'}
                          </span>
                          <button
                            type="button"
                            onClick={eliminarImagen}
                            style={{
                              background: '#FFF0F0',
                              color: 'var(--danger)',
                              border: '1px solid var(--danger)',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Quitar foto
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

Object.assign(window, { AdminView });
