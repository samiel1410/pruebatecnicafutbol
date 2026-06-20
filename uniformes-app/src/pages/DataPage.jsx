import { useState, useMemo } from 'react'
import { useJugadores } from '../hooks/useJugadores'

export default function DataPage() {
  const { jugadores, categorias, sedes, loading } = useJugadores()
  const [filtroCat, setFiltroCat] = useState('')
  const [filtroSede, setFiltroSede] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    return jugadores.filter(j => {
      if (filtroCat && j.categoria !== filtroCat) return false
      if (filtroSede && j.sede !== filtroSede) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        return j.nombre.toLowerCase().includes(q) || j.numero.includes(q) || j.codigo.includes(q)
      }
      return true
    })
  }, [jugadores, filtroCat, filtroSede, busqueda])

  return (
    <div className="container py-4">
      <div className="card border-0 shadow" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
        <div className="card-header-club px-4 py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="club-badge" style={{ width: 42, height: 42 }}><i className="bi bi-database fs-4"></i></div>
            <div>
              <h2 className="h5 fw-bold text-white mb-0">Base de Datos de Jugadores</h2>
              <p className="text-gold-light small mb-0">{loading ? 'Cargando...' : `${jugadores.length} registros`}</p>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="row g-2 mb-4">
            <div className="col-12 col-sm-4">
              <input type="text" className="form-control" placeholder="Buscar nombre, código o número..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
            <div className="col-6 col-sm-3">
              <select className="form-select" value={filtroCat} onChange={e => setFiltroCat(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6 col-sm-3">
              <select className="form-select" value={filtroSede} onChange={e => setFiltroSede(e.target.value)}>
                <option value="">Todas las sedes</option>
                {sedes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-2 d-grid">
              <button className="btn btn-outline-secondary" onClick={() => { setBusqueda(''); setFiltroCat(''); setFiltroSede('') }}>
                <i className="bi bi-x-circle me-1"></i>Limpiar
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark" style={{ background: '#1a4a1a' }}>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>N°</th>
                  <th>Categoría</th>
                  <th>Sede</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(j => (
                  <tr key={j.codigo}>
                    <td className="fw-semibold">{j.codigo}</td>
                    <td>{j.nombre}</td>
                    <td><span className="badge" style={{ background: '#1a4a1a', fontSize: '0.85rem' }}>{j.numero}</span></td>
                    <td>{j.categoria}</td>
                    <td>{j.sede}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Cargando base de datos...</p>
            </div>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">No se encontraron jugadores con esos filtros.</p>
          ) : null}

          {!loading && (
            <p className="text-muted small mt-3 mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Mostrando {filtrados.length} de {jugadores.length} jugadores
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
