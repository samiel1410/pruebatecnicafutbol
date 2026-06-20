import { documentacionHTML } from '../data/documentacion'

export default function DocsPage() {
  return (
    <div className="container py-4">
      <div className="card border-0 shadow" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
        <div className="card-header-club px-4 py-3">
          <div className="d-flex align-items-center gap-3">
            <div className="club-badge" style={{ width: 42, height: 42 }}><i className="bi bi-file-text fs-4"></i></div>
            <div>
              <h2 className="h5 fw-bold text-white mb-0">Documento Explicativo</h2>
              <p className="text-gold-light small mb-0">Solución de Validación de Número de Uniforme</p>
            </div>
          </div>
        </div>
        <div className="card-body p-4 p-md-5 doc-content" dangerouslySetInnerHTML={{ __html: documentacionHTML }} />
      </div>
    </div>
  )
}
