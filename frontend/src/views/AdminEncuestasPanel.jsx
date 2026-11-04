// ============================================================================
// PANEL DE RESULTADOS DE ENCUESTAS (PROMEDIOS Y REGISTROS EN BD LOCAL)
// ============================================================================
function AdminEncuestasPanel({ subproyectoId, onNavigate }) {
  const [datos, setDatos] = useState({ resumen: [], respuestas: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarResumen();
  }, []);

  async function cargarResumen() {
    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${AUTH_API_URL}/api/v1/encuestas/usabilidad/resumen?subproyecto_id=${encodeURIComponent(subproyectoId)}`);
      if (!res.ok) throw new Error('Error consultando resultados de encuestas.');
      const json = await res.json();
      setDatos(json);
    } catch (e) {
      setError('No se pudo conectar con la API de encuestas en el puerto 8000.');
    } finally {
      setCargando(false);
    }
  }

  function emojiPorValor(v) {
    if (v === 1) return '😡 Malo (1)';
    if (v === 2) return '😬 Medio (2)';
    if (v === 3) return '🤩 Excelente (3)';
    return v;
  }

  const resumenActual = datos.resumen && datos.resumen.length > 0 ? datos.resumen[0] : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', marginBottom: '4px' }}>Resultados Encuesta de Usabilidad</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Subproyecto: <strong>{subproyectoId}</strong> · Escala V2 (1 = 😡 Malo, 2 = 😬 Medio, 3 = 🤩 Excelente)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline-green" onClick={cargarResumen}>
            🔄 Actualizar
          </button>
          <button className="btn-green" onClick={() => onNavigate('encuesta')}>
            📝 Responder Encuesta
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={{ padding: '32px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
          Cargando resultados de la base de datos...
        </div>
      ) : error ? (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #E20613', color: '#E20613' }}>
          {error}
        </div>
      ) : (
        <>
          {resumenActual ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>TOTAL RESPUESTAS</div>
                <div className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)', marginTop: '6px' }}>
                  {resumenActual.numero_respuestas}
                </div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>PROMEDIO GENERAL (1-3)</div>
                <div className="font-mont" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--blue)', marginTop: '6px' }}>
                  {resumenActual.promedio_usabilidad} / 3.0
                </div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P1. APRENDIZAJE</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.aprendizaje}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P2. NAVEGACIÓN</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.navegacion}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P3. CLARIDAD</div>
                <div className="font-mont" style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{resumenActual.claridad}</div>
              </div>
              <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>P4. EFICIENCIA / P5. SATISFACCIÓN</div>
                <div className="font-mont" style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}>
                  {resumenActual.eficiencia_percibida} · {resumenActual.satisfaccion}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px', color: 'var(--muted)' }}>
              Aún no hay respuestas registradas para este subproyecto.
            </div>
          )}

          {datos.respuestas && datos.respuestas.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Versión</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>P4</th>
                    <th>P5</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.respuestas.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td style={{ fontWeight: 600 }}>{r.usuario_id}</td>
                      <td>v{r.version_encuesta}</td>
                      <td>{emojiPorValor(r.respuesta_1)}</td>
                      <td>{emojiPorValor(r.respuesta_2)}</td>
                      <td>{emojiPorValor(r.respuesta_3)}</td>
                      <td>{emojiPorValor(r.respuesta_4)}</td>
                      <td>{emojiPorValor(r.respuesta_5)}</td>
                      <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{r.fecha_creacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
