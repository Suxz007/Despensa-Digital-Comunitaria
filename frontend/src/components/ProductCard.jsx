// ============================================================================
// TARJETA DE PRODUCTO CON GESTIÓN (CONTACTAR, MODIFICAR Y ELIMINAR)
// ============================================================================
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

function ProductCard({ product, onSelect, onEdit, onDelete, buttonColor = 'green', showButton = true }) {
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

  function handleEditClick(e) {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    if (onDelete) onDelete(product.id);
  }

  return (
    <article className="product-card" onClick={onSelect}>
      <div className="product-card-img-wrap">
        <img
          src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== DEFAULT_PRODUCT_IMAGE) {
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }
          }}
        />
      </div>
      <div className="product-card-body">
        <div className="product-card-meta-row">
          <span className="product-card-cat">{(product.category || 'Alimentos').toUpperCase()}</span>
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Contactar</span>
          </button>
        )}

        {(onEdit || onDelete) && (
          <div className="product-card-actions">
            {onEdit && (
              <button
                type="button"
                className="product-card-action-btn edit"
                onClick={handleEditClick}
                title="Modificar información o precio"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Modificar</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="product-card-action-btn delete"
                onClick={handleDeleteClick}
                title="Eliminar producto"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Eliminar</span>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

Object.assign(window, { ProductCard, DEFAULT_PRODUCT_IMAGE });
