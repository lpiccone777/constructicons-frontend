import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ScheduleIcon from '@mui/icons-material/Schedule';
import KPICard from '../../components/Reportes/KPICard';
import ExportarPDFButton from '../../components/Reportes/ExportarPDFButton';
import api from '../../services/api';

const DashboardEjecutivoPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.reportes.getDashboardEjecutivo();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Preparar datos para gráfico de estado de proyectos
  const prepareEstadoProyectosData = () => {
    if (!dashboardData) return [];
    
    return Object.entries(dashboardData.resumenProyectos.porEstado).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));
  };

  // Filtrar proyectos principales según estado
  const getProyectosFiltrados = () => {
    if (!dashboardData) return [];
    
    return dashboardData.proyectosPrincipales.filter(proyecto => 
      filtroEstado ? proyecto.estado === filtroEstado : true
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="warning">
        No hay datos disponibles para mostrar.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard Ejecutivo
        </Typography>
        <ExportarPDFButton titulo="Dashboard Ejecutivo" />
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total de Proyectos"
            value={dashboardData.resumenProyectos.total}
            icon={<BusinessIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Presupuesto Total"
            value={`$${dashboardData.resumenProyectos.presupuestoTotal.toLocaleString('es-AR')}`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Presupuesto Ejecutado"
            value={`$${dashboardData.resumenProyectos.presupuestoEjecutadoEstimado.toLocaleString('es-AR')}`}
            subtitle={`${Math.round((dashboardData.resumenProyectos.presupuestoEjecutadoEstimado / dashboardData.resumenProyectos.presupuestoTotal) * 100)}% del total`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="En Ejecución"
            value={dashboardData.resumenProyectos.porEstado.ejecucion}
            subtitle={`${Math.round((dashboardData.resumenProyectos.porEstado.ejecucion / dashboardData.resumenProyectos.total) * 100)}% del total`}
            icon={<ScheduleIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico circular de estados */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Proyectos por Estado
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareEstadoProyectosData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareEstadoProyectosData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} proyectos`, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Especialidades más demandadas */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Especialidades más Demandadas
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.recursosEspecialidades}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="especialidad" />
                  <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                  <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cantidadAsignada" name="Cantidad Asignada" fill={theme.palette.primary.main} />
                  <Bar yAxisId="right" dataKey="proyectosAsignados" name="Proyectos" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Avance de proyectos principales */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Avance de Proyectos Principales
              </Typography>
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="estado-filter-label">Filtrar por Estado</InputLabel>
                <Select
                  labelId="estado-filter-label"
                  id="estado-filter"
                  value={filtroEstado}
                  label="Filtrar por Estado"
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="planificacion">Planificación</MenuItem>
                  <MenuItem value="ejecucion">Ejecución</MenuItem>
                  <MenuItem value="pausado">Pausado</MenuItem>
                  <MenuItem value="finalizado">Finalizado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getProyectosFiltrados()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={70} />
                  <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                  <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avance" name="Avance (%)" fill={theme.palette.primary.main} />
                  <Bar yAxisId="right" dataKey="diasRestantes" name="Días Restantes" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardEjecutivoPage;