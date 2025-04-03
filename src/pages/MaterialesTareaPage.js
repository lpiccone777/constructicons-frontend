// src/pages/MaterialesTareaPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import api from '../services/api';

// Componente para el formulario de asignación de materiales
const AsignacionMaterialForm = ({ tarea, asignacion, onClose, onSave }) => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    materialId: '',
    tareaId: tarea ? tarea.id : '',
    cantidad: '',
    unidadMedida: '',
    estado: 'pendiente',
    observaciones: '',
    ...asignacion
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar lista de materiales disponibles
  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await api.materiales.getMateriales();
        setMateriales(data);
      } catch (err) {
        console.error('Error al cargar materiales:', err);
        setError('No se pudieron cargar los materiales. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el material, actualizar unidad de medida
    if (name === 'materialId') {
      const material = materiales.find(m => m.id === parseInt(value));
      if (material) {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value),
          unidadMedida: material.unidadMedida
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let result;
      if (asignacion) {
        // Solo enviar los campos que el backend espera para actualización
        // No enviar materialId ni tareaId en la actualización
        const dataToSend = {
          cantidad: Number(formData.cantidad).toFixed(2), // Formatear cantidad como decimal con 2 decimales
          unidadMedida: formData.unidadMedida,
          estado: formData.estado,
          observaciones: formData.observaciones
        };
        
        // Actualizar asignación existente
        result = await api.asignacionesMateriales.updateAsignacionMaterial(asignacion.id, dataToSend);
      } else {
        // Para creación sí necesitamos incluir materialId y tareaId
        const dataToSend = {
          materialId: parseInt(formData.materialId),
          tareaId: parseInt(formData.tareaId),
          cantidad: Number(formData.cantidad).toFixed(2), // Formatear cantidad como decimal con 2 decimales
          unidadMedida: formData.unidadMedida,
          estado: formData.estado,
          observaciones: formData.observaciones
        };
        
        // Crear nueva asignación
        result = await api.asignacionesMateriales.createAsignacionMaterial(dataToSend);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar asignación:', err);
      setError(err.response?.data?.message || 'Error al guardar la asignación de material.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {asignacion ? 'Editar Asignación de Material' : 'Asignar Nuevo Material'}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Material</InputLabel>
                <Select
                  name="materialId"
                  value={formData.materialId}
                  onChange={handleChange}
                  label="Material"
                  required
                  disabled={asignacion !== null}
                >
                  {materiales.map(material => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.nombre} - {material.codigo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="cantidad"
                label="Cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unidadMedida"
                label="Unidad de Medida"
                value={formData.unidadMedida}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                  required
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="solicitado">Solicitado</MenuItem>
                  <MenuItem value="comprado">Comprado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="observaciones"
                label="Observaciones"
                value={formData.observaciones || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="dense"
              />
            </Grid>
          </Grid>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting || loading}
        >
          {submitting ? 'Guardando...' : asignacion ? 'Actualizar' : 'Asignar'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const MaterialesTareaPage = () => {
  const { id: tareaId } = useParams();
  const navigate = useNavigate();
  
  const [tarea, setTarea] = useState(null);
  const [materialesAsignados, setMaterialesAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentAsignacion, setCurrentAsignacion] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [asignacionToDelete, setAsignacionToDelete] = useState(null);

  // Cargar datos de la tarea y sus materiales
  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar información de la tarea
      const tareaData = await api.tareas.getTarea(tareaId);
      setTarea(tareaData);
      
      // Cargar materiales asignados
      const asignacionesData = await api.asignacionesMateriales.getAsignacionesMateriales(tareaId);
      setMaterialesAsignados(asignacionesData);
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tareaId]);

  // Manejar apertura del formulario
  const handleOpenForm = (asignacion = null) => {
    setCurrentAsignacion(asignacion);
    setFormDialogOpen(true);
  };

  // Manejar guardado de asignación
  const handleSaveAsignacion = async () => {
    await fetchData();
    setFormDialogOpen(false);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = (asignacion) => {
    setAsignacionToDelete(asignacion);
    setDeleteConfirmOpen(true);
  };

  // Manejar eliminación de asignación
  const handleDeleteAsignacion = async () => {
    try {
      await api.asignacionesMateriales.deleteAsignacionMaterial(asignacionToDelete.id);
      await fetchData();
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Error al eliminar asignación:', err);
      setError('Error al eliminar la asignación. Por favor, intente nuevamente.');
    }
  };

  // Función para renderizar el chip de estado
  const getEstadoChip = (estado) => {
    const config = {
      pendiente: { color: 'default', label: 'Pendiente' },
      solicitado: { color: 'primary', label: 'Solicitado' },
      comprado: { color: 'warning', label: 'Comprado' },
      entregado: { color: 'success', label: 'Entregado' }
    };
    
    const { color, label } = config[estado] || { color: 'default', label: estado };
    
    return <Chip size="small" color={color} label={label} />;
  };

  // Navegar a la página de proyectos
  const handleBack = () => {
    // Navegar al detalle del proyecto
    if (tarea && tarea.etapa && tarea.etapa.proyecto) {
      navigate(`/proyectos/${tarea.etapa.proyecto.id}`);
    } else {
      navigate('/proyectos');
    }
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
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  if (!tarea) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se encontró la tarea</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabecera */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">
            Materiales para Tarea: {tarea.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Etapa: {tarea.etapa.nombre} | Proyecto: {tarea.etapa.proyecto.nombre} ({tarea.etapa.proyecto.codigo})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Asignar Material
        </Button>
      </Box>

      {/* Lista de materiales asignados */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Materiales Asignados
        </Typography>
        
        {materialesAsignados.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay materiales asignados a esta tarea todavía.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio Ref.</TableCell>
                  <TableCell>Total Estimado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialesAsignados.map((asignacion) => {
                  const material = asignacion.material;
                  const precioTotal = Number(asignacion.cantidad) * Number(material.precioReferencia);
                  
                  return (
                    <TableRow key={asignacion.id}>
                      <TableCell>{material.codigo}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{material.nombre}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {material.categoria}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {Number(asignacion.cantidad).toLocaleString('es-AR')} {asignacion.unidadMedida}
                      </TableCell>
                      <TableCell>
                        ${Number(material.precioReferencia).toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        ${precioTotal.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        {getEstadoChip(asignacion.estado)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Ver Material">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/materiales/${material.id}`)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar Asignación">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenForm(asignacion)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar Asignación">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteConfirm(asignacion)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Resumen de costos */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de Costos
        </Typography>
        
        {materialesAsignados.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay materiales asignados para calcular costos.
          </Typography>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Estimado
                  </Typography>
                  <Typography variant="h5">
                    ${materialesAsignados.reduce((total, asignacion) => {
                      return total + (Number(asignacion.cantidad) * Number(asignacion.material.precioReferencia));
                    }, 0).toLocaleString('es-AR')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Materiales
                  </Typography>
                  <Typography variant="h5">
                    {materialesAsignados.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Materiales Entregados
                  </Typography>
                  <Typography variant="h5">
                    {materialesAsignados.filter(a => a.estado === 'entregado').length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Diálogo para crear/editar asignación */}
      <Dialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <AsignacionMaterialForm
          tarea={tarea}
          asignacion={currentAsignacion}
          onClose={() => setFormDialogOpen(false)}
          onSave={handleSaveAsignacion}
        />
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar la asignación del material "{asignacionToDelete?.material?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAsignacion} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialesTareaPage;