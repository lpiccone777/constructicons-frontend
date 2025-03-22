import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api.proyectos.getEstadisticas();
        setStats(statsData);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatusCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}.light`, 
            p: 1, 
            borderRadius: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="body1" paragraph>
        Bienvenido, {user?.nombre || 'Usuario'}! Aquí tienes un resumen de los proyectos.
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard 
                title="Total Proyectos" 
                value={stats?.totalProyectos || 0} 
                icon={<BusinessIcon sx={{ color: 'primary.main' }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard 
                title="En Ejecución" 
                value={stats?.proyectosPorEstado?.find(p => p.estado === 'ejecucion')?._count || 0} 
                icon={<BuildIcon sx={{ color: 'info.main' }} />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard 
                title="Pausados" 
                value={stats?.proyectosPorEstado?.find(p => p.estado === 'pausado')?._count || 0} 
                icon={<PriorityHighIcon sx={{ color: 'warning.main' }} />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard 
                title="Finalizados" 
                value={stats?.proyectosPorEstado?.find(p => p.estado === 'finalizado')?._count || 0}
                icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                color="success"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Presupuesto Total
          </Typography>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h3" component="div">
              ${Number(stats?.presupuestoTotal || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suma de todos los proyectos
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;