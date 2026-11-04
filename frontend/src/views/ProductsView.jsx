// ============================================================================
// VISTA 2: MÓDULO PRODUCTOS (REGISTRAR NUEVO PRODUCTO)
// ============================================================================
function ProductsView({ onSaveProduct, onNavigate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alimentos');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  function handleImageFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setImageFileName(file.name);

    // Leer y comprimir la imagen en un canvas para optimizar tamaño y que se adapte perfecto
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
    setImageFileName('');
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
            <label>Foto del producto</label>
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              background: '#FAFAFA',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}>
              {!imageUrl ? (
                <div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.6" style={{ margin: '0 auto 8px', display: 'block' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <label
                    htmlFor="foto-input"
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
                    Acepta JPG, PNG, WEBP. Se ajusta automáticamente al tamaño de la tarjeta.
                  </p>
                  <input
                    id="foto-input"
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
                    maxWidth: '320px',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
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
