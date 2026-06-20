import { useState, useEffect, useCallback, useRef } from 'react'
import { useJugadores } from '../hooks/useJugadores'

function useToast() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)
  const addToast = useCallback((mensaje, tipo = 'info') => {
    const id = ++idRef.current
    setToasts(prev => [...prev, { id, mensaje, tipo }])
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t)), 3700)
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])
  const ToastContainer = toasts.length > 0 ? (
    <div className="toast-container-fixed">
      {toasts.map(t => (
        <div key={t.id} className={`toast-custom ${t.tipo}${t.removing ? ' removing' : ''}`}>
          <i className={`bi ${t.tipo === 'success' ? 'bi-check-circle-fill' : t.tipo === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}`}></i>
          <span>{t.mensaje}</span>
        </div>
      ))}
    </div>
  ) : null
  return { addToast, ToastContainer }
}

export default function FormPage() {
  const { addToast, ToastContainer } = useToast()
  const { categorias, sedes, buscarJugador, guardarJugador } = useJugadores()
  const [formData, setFormData] = useState({
    nombreCompleto: '', nombreCamiseta: '', significado: '',
    categoria: '', sede: '', numero: '', talla: '',
    tipoUniforme: [], celebracion: '', telefono: '', notas: '',
  })
  const [status, setStatus] = useState(null)
  const [validacionOk, setValidacionOk] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const el = e.target
    if (el.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        tipoUniforme: el.checked ? [...prev.tipoUniforme, el.id] : prev.tipoUniforme.filter(v => v !== el.id)
      }))
    } else {
      setFormData(prev => ({ ...prev, [el.id]: el.value }))
    }
  }

  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.id]: true }))

  const validarNumero = useCallback(() => {
    const { numero, categoria, sede } = formData
    if (!numero) { setStatus(null); setValidacionOk(false); return }
    if (!categoria || !sede) {
      setStatus({ tipo: 'loading', icono: 'bi-exclamation-triangle-fill', texto: 'Seleccione categoría y sede primero' })
      setValidacionOk(false); return
    }
    setStatus({ tipo: 'loading', icono: 'bi-arrow-repeat', texto: 'Validando disponibilidad...', spin: true })
    setValidacionOk(false)
    const t = setTimeout(() => {
      const res = buscarJugador(numero, categoria, sede)
      if (res.disponible) {
        setStatus({ tipo: 'ok', icono: 'bi-check-circle-fill', texto: 'Número disponible' })
        setValidacionOk(true)
      } else {
        setStatus({ tipo: 'error', icono: 'bi-x-circle-fill', texto: <>Número no disponible</> })
        setValidacionOk(false)
      }
    }, 200)
    return () => clearTimeout(t)
  }, [formData.numero, formData.categoria, formData.sede])

  useEffect(() => { validarNumero() }, [validarNumero])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar el número y los uniformes
    if (!validacionOk) { addToast('El número de camiseta no está disponible o no ha sido validado. Elija otro.', 'error'); return }
    if (formData.tipoUniforme.length === 0) { addToast('Seleccione al menos un tipo de uniforme.', 'error'); return }
    
    // Validar campos obligatorios
    const required = ['nombreCompleto', 'nombreCamiseta', 'significado', 'categoria', 'sede', 'numero', 'talla', 'celebracion', 'telefono']
    const empty = required.filter(f => !formData[f]?.trim())
    if (empty.length > 0) {
      setTouched(prev => ({ ...prev, ...Object.fromEntries(empty.map(f => [f, true])) }))
      addToast('Complete todos los campos obligatorios.', 'error'); return
    }
    
    // Validar formato de teléfono
    if (!/^\d{10,}$/.test(formData.telefono.replace(/\D/g, ''))) {
      addToast('Ingrese un número de celular válido (mínimo 10 dígitos).', 'error'); return
    }

    // Generar mensaje de WhatsApp en formato texto simple
    const prendas = formData.tipoUniforme.map(p => p.split(' (')[0]).join(', ');
    const mensajeTexto = `*NUEVO PEDIDO DE UNIFORME* 🛡️\n\n` +
      `*Jugador:* ${formData.nombreCompleto}\n` +
      `*Nombre Camiseta:* ${formData.nombreCamiseta}\n` +
      `*Categoría:* ${formData.categoria} | *Sede:* ${formData.sede}\n` +
      `*Número:* #${formData.numero}\n` +
      `*Talla:* ${formData.talla}\n` +
      `*Prendas:* ${prendas}\n` +
      `*Celular:* ${formData.telefono}\n\n` +
      `_Por favor confirme la recepción de este pedido._`;

    let numeroEnvio = formData.telefono;
    if (numeroEnvio.startsWith('0')) {
      numeroEnvio = '593' + numeroEnvio.substring(1);
    }
    
    // Guardar en JSON (simulando base de datos)
    guardarJugador({
      nombre: formData.nombreCompleto,
      numero: formData.numero,
      categoria: formData.categoria,
      sede: formData.sede
    }).then(() => {
      // Enviar WhatsApp usando la API solicitada
      const formDataWa = new URLSearchParams();
      formDataWa.append('number', numeroEnvio);
      formDataWa.append('message', mensajeTexto);

      fetch('/api-whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataWa
      }).then(() => {
        setEnviado(true);
      }).catch(err => {
        console.error('Error al enviar WhatsApp', err);
        addToast('Pedido guardado, pero hubo un error enviando el WhatsApp.', 'error');
        setEnviado(true);
      });
    }).catch(() => {
      addToast('Hubo un error al guardar el pedido.', 'error');
    });
  }

  if (enviado) {
    return (
      <div className="app-wrapper">
        {ToastContainer}
        <div className="card-main card border-0 shadow">
          <div className="card-header-club">
            <div className="header-content">
              <div className="club-badge"><i className="bi bi-shield-fill-check fs-2"></i></div>
              <div className="text-start">
                <h1 className="header-title">Pedido Oficial de Uniformes</h1>
                <p className="header-subtitle">Quito Highlanders FC</p>
              </div>
            </div>
          </div>
          <div className="card-body p-4 p-md-5 text-center">
            <div className="success-icon"><i className="bi bi-check-circle-fill"></i></div>
            <h3 className="fw-bold mb-2" style={{ color: '#1a4a1a' }}>¡Pedido enviado exitosamente!</h3>
            <p className="text-muted mb-4">Registro simulado correctamente.</p>
            <button className="btn-outline-club" onClick={() => location.reload()}><i className="bi bi-plus-circle me-1"></i>Nuevo pedido</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-wrapper">
      {ToastContainer}
      <div className="card-main card border-0 shadow">
        <div className="card-header-club">
          <div className="header-content">
            <div className="club-badge"><i className="bi bi-shield-fill-check fs-2"></i></div>
            <div className="text-start">
              <h1 className="header-title">Pedido Oficial de Uniformes</h1>
              <p className="header-subtitle">Quito Highlanders FC</p>
            </div>
          </div>
        </div>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div>
                <SectionCard icon="bi-person-fill" title="Datos del jugador">
                  <Field label="Nombre completo" id="nombreCompleto" required
                    help="Dos nombres seguidos de los dos apellidos"
                    placeholder="Ej: Juan José Pérez Martínez"
                    value={formData.nombreCompleto} onChange={handleChange} onBlur={handleBlur} touched={touched.nombreCompleto} />
                  <Field label="Nombre en la camiseta" id="nombreCamiseta" required
                    help="Puede ser su nombre, apellido o un nombre creativo"
                    placeholder="Ej: El Rayo"
                    value={formData.nombreCamiseta} onChange={handleChange} onBlur={handleBlur} touched={touched.nombreCamiseta} />
                  <Textarea label="Significado del nombre" id="significado" required
                    help="Explique el origen o inspiración del nombre"
                    placeholder="¿Por qué eligió ese nombre?"
                    value={formData.significado} onChange={handleChange} onBlur={handleBlur} touched={touched.significado} />
                </SectionCard>

                <SectionCard icon="bi-star-fill" title="Celebración y notas">
                  <Field label="Celular del representante" id="telefono" required type="tel"
                    help="WhatsApp para confirmación del pedido"
                    placeholder="Ej: 0991234567"
                    value={formData.telefono} onChange={handleChange} onBlur={handleBlur} touched={touched.telefono} pattern="[0-9]{10,}" />
                  <Textarea label="Celebración del Jugador" id="celebracion" required
                    help="Describa el gesto de celebración característico"
                    placeholder="Ej: Levantar los brazos y señalar al cielo"
                    value={formData.celebracion} onChange={handleChange} onBlur={handleBlur} touched={touched.celebracion} />
                  <Textarea label="Nota adicional" id="notas" required={false}
                    placeholder="Cualquier información adicional relevante..."
                    value={formData.notas} onChange={handleChange} />
                </SectionCard>
              </div>

              <div>
                <SectionCard icon="bi-geo-alt-fill" title="Categoría y sede">
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label fw-semibold required">Categoría</label>
                      <select className="form-select form-select-lg" id="categoria" value={formData.categoria} onChange={handleChange} onBlur={handleBlur} required>
                        <option value="">Seleccione una opción</option>
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold required">Sede</label>
                      <select className="form-select form-select-lg" id="sede" value={formData.sede} onChange={handleChange} onBlur={handleBlur} required>
                        <option value="">Seleccione una opción</option>
                        {sedes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard icon="bi-123" title="Número de camiseta">
                  <label className="form-label fw-semibold required">Número en la camiseta</label>
                  <div className="form-text mt-0 mb-2">Ingrese el número deseado para el jugador</div>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text fw-bold">#</span>
                    <input type="text" className="form-control" id="numero"
                      placeholder="Ej: 10" value={formData.numero} onChange={handleChange} onBlur={handleBlur} required />
                  </div>
                  {status && (
                    <div className="mt-2">
                      <div className={`status-bar status-${status.tipo}`}>
                        <i className={`bi ${status.icono}${status.spin ? ' spin' : ''}`}></i>
                        <span>{status.texto}</span>
                      </div>
                    </div>
                  )}
                </SectionCard>

                <SectionCard icon="bi-handbag-fill" title="Detalles del uniforme">
                  <label className="form-label fw-semibold required">Tipo de Uniforme o Prenda</label>
                  <div className="form-text mt-0 mb-2">Puede marcar una o más prendas</div>
                  <div className="card bg-light border-0 mb-3">
                    <div className="card-body py-3 px-3">
                      <div className="fw-semibold small text-uppercase mb-2" style={{ color: '#1a4a1a', letterSpacing: '0.04em' }}>
                        <i className="bi bi-trophy-fill me-1" style={{ color: '#d4a017' }}></i>
                        Uniforme titular (verde con dorado)
                      </div>
                      <div className="uniforme-grid">
                        {[
                          { id: 'Uniforme completo (camiseta, pantaloneta y medias)', label: 'Uniforme completo' },
                          { id: 'Solo camiseta', label: 'Solo camiseta' },
                          { id: 'Solo pantaloneta', label: 'Solo pantaloneta' },
                          { id: 'Solo medias', label: 'Solo medias' },
                        ].map(item => (
                          <label key={item.id} className="uniforme-check">
                            <input className="form-check-input" type="checkbox" id={item.id}
                              checked={formData.tipoUniforme.includes(item.id)} onChange={handleChange} />
                            <span className="form-check-label">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="form-label fw-semibold required">Talla</label>
                    <select className="form-select form-select-lg" id="talla" value={formData.talla} onChange={handleChange} onBlur={handleBlur} required>
                      <option value="">Seleccione una talla</option>
                      {['30', '32', '34', '36', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </SectionCard>
              </div>
            </div>

            <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: '#e8e8e8' }}>
              <button type="submit" className="btn-club">
                <i className="bi bi-whatsapp me-2"></i>
                Enviar Pedido por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="section-card mb-4">
      <div className="section-header"><i className={`bi ${icon}`}></i>{title}</div>
      <div className="section-body">{children}</div>
    </div>
  )
}

function Field({ label, id, help, placeholder, value, onChange, onBlur, required, type, touched, pattern }) {
  const inv = touched && required && !value?.trim()
  return (
    <div className="mb-3">
      <label htmlFor={id} className={`form-label fw-semibold${required ? ' required' : ''}`}>{label}</label>
      {help && <div className="form-text mt-0 mb-2">{help}</div>}
      <input type={type || 'text'} className={`form-control form-control-lg${inv ? ' is-invalid' : ''}`}
        id={id} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur}
        required={required} pattern={pattern} autoComplete="off" />
      {inv && <div className="invalid-feedback d-block">Este campo es obligatorio.</div>}
    </div>
  )
}

function Textarea({ label, id, help, placeholder, value, onChange, onBlur, required, touched }) {
  const inv = touched && required && !value?.trim()
  return (
    <div className={required ? 'mb-3' : 'mb-4'}>
      <label htmlFor={id} className={`form-label fw-semibold${required ? ' required' : ''}`}>{label}</label>
      {help && <div className="form-text mt-0 mb-2">{help}</div>}
      <textarea className={`form-control${inv ? ' is-invalid' : ''}`} id={id} rows="3"
        placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur}
        required={required}></textarea>
      {inv && <div className="invalid-feedback d-block">Este campo es obligatorio.</div>}
    </div>
  )
}
