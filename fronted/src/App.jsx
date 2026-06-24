import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import EmpresaDashboard from './pages/empresa/Dashboard';
import EmpresaPublicar from './pages/empresa/PublicarExcedente';
import OngFeed from './pages/ong/Feed';
import OngReclamar from './pages/ong/Reclamar';
import AdminDashboard from './pages/admin/Dashboard';

import './App.css';

// Componente para redireccionar a la ruta correcta tras el login o al abrir la app base '/'
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.rol) {
    case 'empresa': return <Navigate to="/empresa/dashboard" replace />;
    case 'ong': return <Navigate to="/ong/feed" replace />;
    case 'admin': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content" style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas de Empresa */}
            <Route path="/empresa/dashboard" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                <EmpresaDashboard />
              </ProtectedRoute>
            } />
            <Route path="/empresa/publicar" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                <EmpresaPublicar />
              </ProtectedRoute>
            } />

            {/* Rutas de ONG */}
            <Route path="/ong/feed" element={
              <ProtectedRoute allowedRoles={['ong']}>
                <OngFeed />
              </ProtectedRoute>
            } />
            <Route path="/ong/reclamar/:id" element={
              <ProtectedRoute allowedRoles={['ong']}>
                <OngReclamar />
              </ProtectedRoute>
            } />

            {/* Rutas de Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Fallback para páginas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
