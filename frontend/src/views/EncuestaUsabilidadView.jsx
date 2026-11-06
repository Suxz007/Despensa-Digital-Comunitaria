// ============================================================================
// VISTA ENCUESTA DE USABILIDAD (ESTANDARIZADA TRAVESÍAS V2 CON CARITAS)
// ============================================================================
function EncuestaUsabilidadView({ subproyectoId, nombreSubproyecto, onCancelar }) {
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const [error, setError] = useState(null);

  const completadas = Object.keys(respuestas).length;

  function seleccionarOpcion(numeroPregunta, valor) {
    if (enviando) return;
    setRespuestas(prev => ({ ...prev, [numeroPregunta]: valor }));
    setError(null);
  }

  async function handleEnviar() {
    if (enviando || enviada || completadas !== 5) return;

    const tokenActual = sessionStorage.getItem('access_token') || sessionStorage.getItem('token') || 'token-comunitario-local';

    setEnviando(true);
    setError(null);

    const payload = {
      subproyecto_id: subproyectoId,
      version_encuesta: 2,
      respuestas: {
        respuesta_1: respuestas[1],
        respuesta_2: respuestas[2],
        respuesta_3: respuestas[3],
        respuesta_4: respuestas[4],
        respuesta_5: respuestas[5]
      }
    };

    try {
      const res = await fetch(`${AUTH_API_URL}/api/v1/encuestas/usabilidad`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenActual}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 200 || res.status === 201) {
        setEnviada(true);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError('Ya respondiste esta versión de la encuesta en este subproyecto.');
      } else if (res.status === 422) {
        setError('Las respuestas enviadas no son válidas.');
      } else {
        setError(data.detail || 'No se pudieron guardar tus respuestas. Inténtalo más tarde.');
      }
    } catch (e) {
      setError('No fue posible conectar con el servidor de encuestas.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ backgroundColor: '#F8F9FA', flex: 1, padding: '24px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Barra de Identidad Institucional extraída del módulo */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          border: '1px solid #DEE2E6',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px'
        }}>
          <img src="assets/images/escudo_uniamazonia.png" alt="Universidad de la Amazonia" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
          <img src="assets/images/logo_sistemas.png" alt="Programa de Ingeniería de Sistemas" style={{ height: '54px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {enviada ? (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px 24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid #DEE2E6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '54px', color: '#007A33', marginBottom: '12px' }}>✓</div>
            <h2 className="font-mont" style={{ fontSize: '24px', fontWeight: 700, color: '#212529', marginBottom: '8px' }}>
              ¡Gracias por tu opinión!
            </h2>
            <p style={{ fontSize: '16px', color: '#212529', marginBottom: '24px' }}>
              Tu encuesta se guardó correctamente en el subproyecto correspondiente.
            </p>
            <button className="btn-outline-green" onClick={onCancelar} style={{ height: '48px', padding: '0 20px' }}>
              ← Volver al subproyecto
            </button>
          </div>
        ) : (
          <div>
            <h1 className="font-mont" style={{ fontSize: '24px', fontWeight: 700, color: '#212529', marginBottom: '8px' }}>
              Encuesta de usabilidad
            </h1>
            <p style={{ fontSize: '16px', color: '#212529', marginBottom: '12px' }}>
              Cuéntanos cómo fue tu experiencia. Elige una carita por afirmación.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: '#212529', flexWrap: 'wrap' }}>
              <span style={{ color: '#0085CA', fontWeight: 700 }}>❖</span>
              <span>Subproyecto: <strong>{nombreSubproyecto || subproyectoId}</strong></span>
            </div>

            {/* Tarjeta de progreso */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #DEE2E6',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="font-mont" style={{ fontSize: '14px', fontWeight: 600 }}>Tu progreso</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{completadas} de 5</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#E4EEE7', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{
                  width: `${(completadas / 5) * 100}%`,
                  height: '100%',
                  background: '#007A33',
                  transition: 'width 0.2s ease'
                }} />
              </div>
              <div style={{ fontSize: '14px', color: '#212529' }}>
                Evaluación: 😡 Malo  ·  😬 Medio  ·  🤩 Excelente
              </div>
            </div>

            {/* 5 Preguntas Oficiales */}
            {PREGUNTAS_ENCUESTA.map(pregunta => {
              const marcada = respuestas[pregunta.numero];
              const opcionMarcada = OPCIONES_EVALUACION.find(o => o.valor === marcada);

              return (
                <div
                  key={pregunta.numero}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    border: '1px solid #DEE2E6',
                    marginBottom: '12px'
                  }}
                >
                  <div className="font-mont" style={{ fontSize: '16px', fontWeight: 600, color: '#212529', marginBottom: '16px' }}>
                    {pregunta.numero}. {pregunta.texto}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {OPCIONES_EVALUACION.map(opcion => {
                      const isSelected = marcada === opcion.valor;
                      return (
                        <button
                          key={opcion.valor}
                          type="button"
                          onClick={() => seleccionarOpcion(pregunta.numero, opcion.valor)}
                          disabled={enviando}
                          style={{
                            background: isSelected ? '#E2F2E8' : '#FFFFFF',
                            border: isSelected ? '2px solid #007A33' : '1px solid #DEE2E6',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            cursor: enviando ? 'wait' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '92px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '30px', lineHeight: 1.1 }}>{opcion.emoji}</span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#212529', marginTop: '6px' }}>
                            {opcion.etiqueta}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {opcionMarcada && (
                    <div style={{ marginTop: '12px', fontSize: '14px', color: '#007A33', fontWeight: 500 }}>
                      Tu elección: {opcionMarcada.emoji} {opcionMarcada.etiqueta}
                    </div>
                  )}
                </div>
              );
            })}

            {error && (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #E20613',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#E20613',
                fontSize: '14px'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <p style={{ fontSize: '14px', color: '#6C757D', marginTop: '8px', marginBottom: '16px' }}>
              Las respuestas se asociarán a este subproyecto y a tu cuenta del inicio de sesión único. No solicitamos datos personales adicionales.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <button
                type="button"
                className="btn-outline-green"
                style={{ height: '48px', padding: '0 20px' }}
                onClick={onCancelar}
                disabled={enviando}
              >
                ← Regresar
              </button>
              <button
                type="button"
                className="btn-green"
                style={{
                  height: '48px',
                  padding: '0 20px',
                  opacity: (enviando || completadas !== 5) ? 0.6 : 1,
                  cursor: (enviando || completadas !== 5) ? 'not-allowed' : 'pointer'
                }}
                disabled={enviando || completadas !== 5}
                onClick={handleEnviar}
              >
                {enviando ? 'Enviando...' : '📩 Enviar respuestas'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

Object.assign(window, { EncuestaUsabilidadView });
