// ============================================================================
// TARJETA DE PRODUCTO (IDÉNTICA A LA CAPTURA DE FLUTTER)
// ============================================================================
function ProductCard({ product, onSelect, buttonColor = 'blue', showButton = true }) {
  function handleContactClick(e) {
    e.stopPropagation();
    try {
      fetch(`${AUTH_API_URL}/api/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: sessionStorage.getItem('usuario') || 'Usuario Red Comunitaria',
          telefono: '3100000000',
          correo: 'comunidad@uniamazonia.edu.co',
          tipo_solicitante: 'Comunidad Universitaria',
          id_producto: product.id,
          cantidad_solicitada: 1,
          mensaje: `Interesado en ${product.name} (${product.price})`
        })
      });
    } catch (err) {
      console.warn('Registro de solicitud local:', err);
    }
    const texto = encodeURIComponent(`Hola, me interesa el producto "${product.name}" (${product.price}) de la Red Comunitaria Uniamazonia.`);
    window.open(`https://wa.me/573100000000?text=${texto}`, '_blank');
  }

  return (
    <article className="product-card" onClick={onSelect}>
      <div className="product-card-img-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <div className="product-card-meta-row">
          <span className="product-card-cat">{product.category.toUpperCase()}</span>
          <span className={`status-badge ${product.available ? 'ok' : 'off'}`}>
            {product.available ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        <h3 className="product-card-title">{product.name}</h3>
        <div className="product-card-price">{product.price}</div>

        {showButton && (
          <button
            type="button"
            className={`product-card-contact-btn ${buttonColor}`}
            onClick={handleContactClick}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Contactar</span>
          </button>
        )}
      </div>
    </article>
  );
}

Object.assign(window, { ProductCard });
