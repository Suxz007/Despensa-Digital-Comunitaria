// ============================================================================
// PANEL DE FILTROS REUTILIZABLE (SIDEBAR DESKTOP + MODAL MÓVIL)
// ============================================================================
function FilterPanel({ selectedCats, onToggleCat, onlyAvailable, onToggleAvailable, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  return (
    <div className="filter-panel">
      <div className="filter-title">Filtros</div>
      <div className="filter-divider"></div>

      <div className="filter-section-label">Categoría</div>
      {CATEGORIES.map(cat => {
        const checked = selectedCats.includes(cat);
        return (
          <div key={cat} className="custom-check-row" onClick={() => onToggleCat(cat)}>
            <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>
              {checked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span>{cat}</span>
          </div>
        );
      })}

      <div className="filter-divider"></div>

      <div className="filter-section-label">Disponibilidad</div>
      <div className="toggle-row">
        <span>Solo disponibles</span>
        <div
          className={`app-toggle ${onlyAvailable ? 'active' : ''}`}
          onClick={() => onToggleAvailable(!onlyAvailable)}
        >
          <div className="app-toggle-knob"></div>
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-section-label">Rango de precio</div>
      <div className="price-range-row">
        <input
          type="number"
          className="price-input"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span style={{ color: 'var(--muted)' }}>-</span>
        <input
          type="number"
          className="price-input"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
}

Object.assign(window, { FilterPanel });
