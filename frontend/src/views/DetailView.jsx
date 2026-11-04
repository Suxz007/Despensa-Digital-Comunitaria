// ============================================================================
// VISTA 3: DETALLE DE PRODUCTO
// ============================================================================
function DetailView({ product, relatedProducts, onBack, onSelectProduct }) {
  function contactarWhatsapp() {
    const texto = encodeURIComponent(`Hola, me interesa el producto "${product.name}" (${product.price}) que vi en la Red Comunitaria Uniamazonia.`);
    window.open(`https://wa.me/573100000000?text=${texto}`, '_blank');
  }

  return (
    <main className="centered" style={{ paddingTop: '32px', paddingBottom: '56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--muted)' }}>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>Productos</span>
        <span>›</span>
        <span>{product.category}</span>
        <span>›</span>
        <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</strong>
      </div>

      <div className="detail-layout">
        <div>
          <img className="detail-img" src={product.imageUrl} alt={product.name} />
        </div>

        <div className="detail-panel">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ background: 'var(--tag-bg)', color: 'var(--blue)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              {product.category}
            </span>
            <span className={`status-badge ${product.available ? 'ok' : 'off'}`}>
              {product.available ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <h1 style={{ fontSize: '30px', marginBottom: '20px' }}>{product.name}</h1>

          <div style={{ marginBottom: '20px' }}>
            <span className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>
              {product.price}
            </span>
            {product.unit && (
              <span className="font-mont" style={{ color: 'var(--muted)', fontSize: '16px', marginLeft: '6px' }}>
                {product.unit}
              </span>
            )}
          </div>

          <div className="filter-divider" style={{ margin: '20px 0' }}></div>

          <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Descripción</h4>
          <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '24px' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <strong className="font-mont" style={{ fontSize: '14px' }}>Presentación:</strong>
            <span style={{ padding: '6px 12px', background: 'var(--bg)', border: '1px solid var(--green)', borderRadius: '6px', color: 'var(--green)', fontSize: '13px', fontWeight: 600 }}>
              {product.presentation || 'Frasco de Vidrio 500ml'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-blue" style={{ flex: 1, height: '48px' }} onClick={contactarWhatsapp}>
              💬 Contactar por WhatsApp
            </button>
            <button className="btn-outline-grey" style={{ height: '48px' }} onClick={onBack}>
              Volver
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Productos Relacionados</h3>
      <div className="products-grid-catalog">
        {relatedProducts.map(rel => (
          <ProductCard
            key={rel.id}
            product={rel}
            onSelect={() => onSelectProduct(rel)}
          />
        ))}
      </div>
    </main>
  );
}

Object.assign(window, { DetailView });
