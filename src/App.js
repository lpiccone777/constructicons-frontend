import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProyectosPage from './pages/ProyectosPage';
import ProyectoDetallePage from './pages/ProyectoDetallePage'; // Nuevo import
import { useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(60);

  // Handler para actualizar el ancho del sidebar
  const handleSidebarWidthChange = (width) => {
    setSidebarWidth(width);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Sidebar */}
      {user && <Sidebar onWidthChange={handleSidebarWidthChange} />}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          ml: { sm: `${sidebarWidth}px` },
          mt: 8, // Espacio para la Navbar
          transition: 'margin 0.3s',
          overflowY: 'auto',
          height: `calc(100vh - 64px)`, // Resta la altura de la Navbar
        }}
      >
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/proyectos" element={
            <ProtectedRoute>
              <ProyectosPage />
            </ProtectedRoute>
          } />
          
          {/* Nueva ruta para detalles de proyectos */}
          <Route path="/proyectos/:id" element={
            <ProtectedRoute>
              <ProyectoDetallePage />
            </ProtectedRoute>
          } />
          
          {/* Redirigir a la página principal si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;