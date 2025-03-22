import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MaterialesProyectoTab = ({ proyectoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumenMateriales, setResumenMateriales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await api.asignacionesMateriales.getResumenMaterialesPorProyecto(proyectoId);
        setResumenMateriales(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar resumen de materiales:', err);
        setError('No se pudo cargar el resumen de materiales. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (proyectoId) {
      fetchMateriales();
    }
  }, [proyectoId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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

  if (resumenMateriales.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No hay materiales asignados a este proyecto todavía.
      </Alert>
    );
  }

  // Calcular totales
  const totalCostoEstimado = resumenMateriales.reduce(
    (total, material) => total + Number(material.costoEstimado), 
    0
  );

  const totalMaterialesPendientes = resumenMateriales.reduce(
    (total, material) => {
      return total + (material.cantidadPorEstado.pendiente > 0 ? 1 : 0);
    }, 
    0
  );

  return (
    <Box>
      {/* Resumen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Costo Total Estimado
            </Typography>
            <Typography variant="h5">
              ${totalCostoEstimado.toLocaleString('es-AR')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Materiales
            </Typography>
            <Typography variant="h5">
              {resumenMateriales.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Materiales Pendientes
            </Typography>
            <Typography variant="h5" color={totalMaterialesPendientes > 0 ? 'warning.main' : 'text.primary'}>
              {totalMaterialesPendientes}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de materiales */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Cantidad Total</TableCell>
              <TableCell>Costo Estimado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resumenMateriales.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.codigo}</TableCell>
                <TableCell>{material.nombre}</TableCell>
                <TableCell>{material.categoria}</TableCell>
                <TableCell>
                  {Number(material.cantidadTotal).toLocaleString('es-AR')} {material.unidadMedida}
                </TableCell>
                <TableCell>
                  ${Number(material.costoEstimado).toLocaleString('es-AR')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {material.cantidadPorEstado.pendiente > 0 && (
                      <Chip 
                        size="small" 
                        label={`Pendiente: ${material.cantidadPorEstado.pendiente} ${material.unidadMedida}`} 
                        color="default" 
                        variant="outlined" 
                      />
                    )}
                    {material.cantidadPorEstado.solicitado > 0 && (
                      <Chip 
                        size="small" 
                        label={`Solicitado: ${material.cantidadPorEstado.solicitado} ${material.unidadMedida}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                    {material.cantidadPorEstado.comprado > 0 && (
                      <Chip 
                        size="small" 
                        label={`Comprado: ${material.cantidadPorEstado.comprado} ${material.unidadMedida}`} 
                        color="warning" 
                        variant="outlined" 
                      />
                    )}
                    {material.cantidadPorEstado.entregado > 0 && (
                      <Chip 
                        size="small" 
                        label={`Entregado: ${material.cantidadPorEstado.entregado} ${material.unidadMedida}`} 
                        color="success" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Ver Material">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/materiales/${material.id}`)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MaterialesProyectoTab;