import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProyectosPage from './pages/ProyectosPage';
import ProyectoDetallePage from './pages/ProyectoDetallePage';
import MaterialesPage from './pages/MaterialesPage';
import MaterialDetallePage from './pages/MaterialDetallePage';
import ProveedoresPage from './pages/ProveedoresPage';
import ProveedorDetallePage from './pages/ProveedorDetallePage';
import MaterialesTareaPage from './pages/MaterialesTareaPage';
import ProveedoresMaterialPage from './pages/ProveedoresMaterialPage';
import MaterialesProveedorPage from './pages/MaterialesProveedorPage';
import GremiosPage from './pages/GremiosPage';
import EspecialidadesPage from './pages/EspecialidadesPage';
import EmpleadosPage from './pages/EmpleadosPage';
import { useAuth } from './context/AuthContext';
import ReportesPage from './pages/Reportes/ReportesPage';


// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos"
            element={
              <ProtectedRoute>
                <ProyectosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/:id"
            element={
              <ProtectedRoute>
                <ProyectoDetallePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiales"
            element={
              <ProtectedRoute>
                <MaterialesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiales/:id"
            element={
              <ProtectedRoute>
                <MaterialDetallePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores"
            element={
              <ProtectedRoute>
                <ProveedoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores/:id"
            element={
              <ProtectedRoute>
                <ProveedorDetallePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tareas/:id/materiales"
            element={
              <ProtectedRoute>
                <MaterialesTareaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materiales/:id/proveedores"
            element={
              <ProtectedRoute>
                <ProveedoresMaterialPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proveedores/:id/materiales"
            element={
              <ProtectedRoute>
                <MaterialesProveedorPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas nuevas para los módulos de RRHH integrados en Recursos */}
          <Route
            path="/gremios"
            element={
              <ProtectedRoute>
                <GremiosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/especialidades"
            element={
              <ProtectedRoute>
                <EspecialidadesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empleados"
            element={
              <ProtectedRoute>
                <EmpleadosPage />
              </ProtectedRoute>
            }
          />
          {/* Rutas para Asignaciones de Especialidades y Empleados a Etapas y Tareas */}
          <Route
            path="/etapas/:id/asignar-empleados"
            element={
              <ProtectedRoute>
                {/* Crea la vista correspondiente */}
                <EmpleadosPage asignarA="etapa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/etapas/:id/asignar-especialidades"
            element={
              <ProtectedRoute>
                {/* Crea la vista correspondiente */}
                <EspecialidadesPage asignarA="etapa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tareas/:id/asignar-empleados"
            element={
              <ProtectedRoute>
                {/* Crea la vista correspondiente */}
                <EmpleadosPage asignarA="tarea" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tareas/:id/asignar-especialidades"
            element={
              <ProtectedRoute>
                {/* Crea la vista correspondiente */}
                <EspecialidadesPage asignarA="tarea" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes/*"
            element={
              <ProtectedRoute>
                <ReportesPage />
              </ProtectedRoute>
            }
          />

          {/* Redirigir si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
