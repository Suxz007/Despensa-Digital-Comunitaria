// ============================================================================
// PIE DE PÁGINA INSTITUCIONAL (COMPACTO - SOLO LOGOS OFICIALES)
// ============================================================================
function Footer() {
  return (
    <footer className="footer">
      <div className="centered">
        <div className="footer-logos">
          <div className="footer-logo-card">
            <img src="assets/images/escudo_uniamazonia.png" alt="Universidad de la Amazonia" />
          </div>
          <div className="footer-logo-card">
            <img src="assets/images/logo_sistemas.png" alt="Ingeniería de Sistemas" />
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
