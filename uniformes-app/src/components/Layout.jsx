import { NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark" style={{ background: '#0f2f0f', borderBottom: '3px solid #d4a017' }}>
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <i className="bi bi-shield-fill-check" style={{ color: '#f0c040' }}></i>
            <span className="fw-bold">Highlanders FC</span>
          </NavLink>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-1">
              <li className="nav-item">
                <NavLink className="nav-link px-3 rounded" to="/"
                  style={({ isActive }) => ({ background: isActive ? 'rgba(212,160,23,0.2)' : 'transparent', color: isActive ? '#f0c040' : 'rgba(255,255,255,0.8)' })}>
                  <i className="bi bi-pencil-square me-1"></i>Formulario
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3 rounded" to="/data"
                  style={({ isActive }) => ({ background: isActive ? 'rgba(212,160,23,0.2)' : 'transparent', color: isActive ? '#f0c040' : 'rgba(255,255,255,0.8)' })}>
                  <i className="bi bi-database me-1"></i>Base de Datos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3 rounded" to="/docs"
                  style={({ isActive }) => ({ background: isActive ? 'rgba(212,160,23,0.2)' : 'transparent', color: isActive ? '#f0c040' : 'rgba(255,255,255,0.8)' })}>
                  <i className="bi bi-file-text me-1"></i>Documentaci&oacute;n
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  )
}
