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
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  WorkOutline as WorkIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AsignacionesProyectoTab = ({ proyectoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  const navigate = useNavigate();

  // Cargar empleados del proyecto usando el nuevo endpoint
  useEffect(() => {
    const fetchEmpleadosProyecto = async () => {
      setLoading(true);
      try {
        const data = await api.proyectos.getEmpleadosProyecto(proyectoId);
        setEmpleados(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar empleados del proyecto:', err);
        setError('No se pudieron cargar los empleados asignados al proyecto.');
      } finally {
        setLoading(false);
      }
    };

    if (proyectoId) {
      fetchEmpleadosProyecto();
    }
  }, [proyectoId]);

  // Función para abrir el diálogo y cargar empleados disponibles
  const handleOpenDialog = async () => {
    setOpenDialog(true);
    setSelectedEmpleado('');
    setLoadingEmpleados(true);
    
    try {
      // Cargar lista de todos los empleados
      const todosEmpleados = await api.empleados.getEmpleados();
      
      // Filtrar empleados que ya están asignados al proyecto
      const empleadosAsignadosIds = empleados.map(emp => emp.id);
      const disponibles = todosEmpleados.filter(emp => !empleadosAsignadosIds.includes(emp.id));
      
      setEmpleadosDisponibles(disponibles);
    } catch (err) {
      console.error('Error al cargar empleados disponibles:', err);
      setError('No se pudieron cargar los empleados disponibles.');
    } finally {
      setLoadingEmpleados(false);
    }
  };

  // Función para asignar empleado al proyecto
  const handleAsignarEmpleado = async () => {
    if (!selectedEmpleado) return;
    
    setDialogLoading(true);
    try {
      // Crear nueva asignación al proyecto
      await api.asignaciones.createAsignacionProyecto({
        proyectoId: Number(proyectoId),
        empleadoId: Number(selectedEmpleado)
      });
      
      // Recargar empleados del proyecto para reflejar el cambio
      const data = await api.proyectos.getEmpleadosProyecto(proyectoId);
      setEmpleados(data);
      
      setOpenDialog(false);
    } catch (err) {
      console.error('Error al asignar empleado:', err);
      setError('No se pudo asignar el empleado al proyecto.');
    } finally {
      setDialogLoading(false);
    }
  };

  // Función para eliminar una asignación
  const handleEliminarAsignacion = async (empleadoId) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;
    
    try {
      // Buscar la asignación para este empleado y proyecto
      const asignaciones = await api.asignaciones.getAsignacionesProyecto(proyectoId);
      const asignacion = asignaciones.find(a => a.empleadoId === empleadoId);
      
      if (asignacion) {
        await api.asignaciones.deleteAsignacionProyecto(asignacion.id);
        
        // Actualizar la lista de empleados
        setEmpleados(prev => prev.filter(emp => emp.id !== empleadoId));
      } else {
        setError('No se encontró la asignación para eliminar.');
      }
    } catch (err) {
      console.error('Error al eliminar asignación:', err);
      setError('No se pudo eliminar la asignación.');
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para obtener color según el estado
  const getEstadoColor = (estado) => {
    const estados = {
      'pendiente': 'default',
      'en-progreso': 'primary',
      'completada': 'success',
      'retrasada': 'error'
    };
    return estados[estado] || 'default';
  };

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

  return (
    <Box>
      {/* Resumen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Empleados Asignados
            </Typography>
            <Typography variant="h5">
              {empleados.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Asignaciones a Tareas
            </Typography>
            <Typography variant="h5">
              {empleados.reduce((total, emp) => total + (emp.asignaciones?.length || 0), 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'flex-start', md: 'flex-end'} }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Asignar Empleado
          </Button>
        </Grid>
      </Grid>

      {/* Sin empleados */}
      {empleados.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No hay empleados asignados a este proyecto todavía.
        </Alert>
      )}

      {/* Lista de empleados con acordeón para detalles */}
      {empleados.length > 0 && (
        <Box>
          {empleados.map((empleado) => (
            <Accordion key={empleado.id} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${empleado.id}-content`}
                id={`panel-${empleado.id}-header`}
              >
                <Grid container alignItems="center">
                  <Grid item xs={1}>
                    <PersonIcon color="primary" />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1">{empleado.nombre}</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {empleado.asignaciones && empleado.asignaciones.length > 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          {empleado.asignaciones.length} tarea{empleado.asignaciones.length !== 1 ? 's' : ''} asignada{empleado.asignaciones.length !== 1 ? 's' : ''}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Sin tareas asignadas</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email: {empleado.email || 'No disponible'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono: {empleado.telefono || 'No disponible'}
                      </Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Ver Perfil Empleado">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/empleados/${empleado.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Asignación">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleEliminarAsignacion(empleado.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Asignaciones de tareas */}
                  {empleado.asignaciones && empleado.asignaciones.length > 0 ? (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Tareas Asignadas:
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Tarea</TableCell>
                              <TableCell>Etapa</TableCell>
                              <TableCell>Estado</TableCell>
                              <TableCell>Horas</TableCell>
                              <TableCell>Fecha Asignación</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {empleado.asignaciones.map((asignacion) => (
                              <TableRow key={asignacion.asignacionId}>
                                <TableCell>{asignacion.tareaNombre}</TableCell>
                                <TableCell>{asignacion.etapaNombre}</TableCell>
                                <TableCell>
                                  <Chip 
                                    size="small" 
                                    color={getEstadoColor(asignacion.estado)} 
                                    label={asignacion.estado.replace('-', ' ')} 
                                    variant="outlined" 
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {asignacion.horasRegistradas}/{asignacion.horasEstimadas}h
                                  </Box>
                                </TableCell>
                                <TableCell>{formatDate(asignacion.fechaAsignacion)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Este empleado está asignado al proyecto pero no tiene tareas específicas.
                    </Alert>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Diálogo para asignar empleado */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Empleado al Proyecto</DialogTitle>
        <DialogContent>
          {loadingEmpleados ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : empleadosDisponibles.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay empleados disponibles para asignar.
            </Alert>
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Seleccionar Empleado</InputLabel>
              <Select
                value={selectedEmpleado}
                onChange={(e) => setSelectedEmpleado(e.target.value)}
                label="Seleccionar Empleado"
              >
                {empleadosDisponibles.map((empleado) => (
                  <MenuItem key={empleado.id} value={empleado.id}>
                    {empleado.nombre} - {empleado.cargo || 'Sin cargo'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAsignarEmpleado} 
            variant="contained" 
            disabled={!selectedEmpleado || dialogLoading}
            startIcon={dialogLoading ? <CircularProgress size={20} /> : null}
          >
            {dialogLoading ? 'Asignando...' : 'Asignar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AsignacionesProyectoTab;