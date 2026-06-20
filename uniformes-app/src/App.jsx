import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import FormPage from './pages/FormPage'
import DataPage from './pages/DataPage'
import DocsPage from './pages/DocsPage'
import './App.css'

export default function App() {
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
