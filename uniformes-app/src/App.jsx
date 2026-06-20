import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Layout from './components/Layout'
import FormPage from './pages/FormPage'
import DataPage from './pages/DataPage'
import DocsPage from './pages/DocsPage'
import './App.css'

export default function App() {
  const hasVisited = useRef(false);

  useEffect(() => {
    if (!hasVisited.current) {
      hasVisited.current = true;
      const formDataWa = new URLSearchParams();
      formDataWa.append('number', '593962622593');
      formDataWa.append('message', '¡Alerta! Alguien ha entrado a la página web de uniformes.');

      fetch('/api-whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataWa
      }).catch(err => console.error('Error al enviar alerta de visita', err));
    }
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
