// ============================================================================
// PIE DE PÁGINA INSTITUCIONAL
// ============================================================================
function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="centered">
        <div className="footer-top">
          <div style={{ maxWidth: '456px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Red Comunitaria Uniamazonia</h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Una iniciativa institucional para fomentar la economía solidaria y visibilizar el trabajo de nuestra comunidad universitaria.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div className="footer-col">
              <h4>Enlaces</h4>
              <ul>
                <li><button onClick={() => onNavigate('home')}>Inicio</button></li>
                <li><button onClick={() => onNavigate('productos')}>Productos</button></li>
                <li><button onClick={() => onNavigate('encuesta')}>Encuesta de Usabilidad</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Soporte</h4>
              <ul>
                <li><button onClick={() => onNavigate('home')}>Preguntas Frecuentes</button></li>
                <li><button onClick={() => onNavigate('home')}>Contacto</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-logos">
          <div className="footer-logo-card">
            <img src="assets/images/escudo_uniamazonia.png" alt="Universidad de la Amazonia" />
          </div>
          <div className="footer-logo-card">
            <img src="assets/images/logo_sistemas.png" alt="Ingeniería de Sistemas" />
          </div>
        </div>

        <div className="footer-copy">
          © 2026 Red Comunitaria Uniamazonia. Todos los derechos reservados. Universidad de la Amazonia.
        </div>
      </div>
    </footer>
  );
}

function WhatsappFab() {
  return (
    <button
      className="whatsapp-fab"
      title="Contactar por WhatsApp"
      onClick={() => window.open('https://wa.me/573100000000', '_blank')}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
}

