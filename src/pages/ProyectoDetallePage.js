import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  DeleteOutline, 
  Add, 
  PriorityHigh, 
  EventNote,
  AccessTime,
  Group,
  Description,
  Comment
} from '@mui/icons-material';
import api from '../services/api';

// Panel de contenido para las pestañas
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proyecto-tabpanel-${index}`}
      aria-labelledby={`proyecto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Formulario para crear/editar etapas
const EtapaForm = ({ etapa, proyectoId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proyectoId: proyectoId,
    orden: 1,
    fechaInicio: '',
    fechaFinEstimada: '',
    presupuesto: '',
    estado: 'pendiente',
    avance: 0,
    ...etapa
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      let result;
      
      // Preparar los datos para enviar al API, asegurando tipos correctos
      const dataToSend = {
        ...formData,
        proyectoId: Number(formData.proyectoId), // Convertir a número
        orden: Number(formData.orden), // Convertir a número
        presupuesto: formData.presupuesto.toString(), // Convertir a string
        avance: Number(formData.avance), // Convertir a número
      };
      
      if (etapa) {
        result = await api.etapas.updateEtapa(etapa.id, dataToSend);
      } else {
        result = await api.etapas.createEtapa(dataToSend);
      }
      
      onSave(result);
    } catch (err) {
      console.error('Error al guardar etapa:', err);
      setError(err.response?.data?.message || 'Error al guardar la etapa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>
        {etapa ? 'Editar Etapa' : 'Crear Nueva Etapa'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Orden"
                name="orden"
                type="number"
                value={formData.orden}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Inicio"
                name="fechaInicio"
                type="date"
                value={formData.fechaInicio || ''}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Fin Estimada"
                name="fechaFinEstimada"
                type="date"
                value={formData.fechaFinEstimada || ''}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Presupuesto"
                name="presupuesto"
                type="number"
                value={formData.presupuesto}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_progreso">En Progreso</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Avance (%)"
                name="avance"
                type="number"
                value={formData.avance}
                onChange={handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                margin="normal"
              />
            </Grid>
          </Grid>
          {error && (
  <Alert severity="error" sx={{ mt: 2 }}>
    {typeof error === 'string' 
      ? error 
      : Array.isArray(error) 
        ? error.join(', ') 
        : 'Error al guardar la etapa'}
  </Alert>
)}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : etapa ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

// Formulario para crear/editar tareas
const TareaForm = ({ tarea, etapaId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    etapaId: etapaId,
    orden: 1,
    fechaInicio: '',
    fechaFinEstimada: '',
    estado: 'pendiente',
    prioridad: 'media',
    ...tarea
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      let result;
      
      // Preparar datos con tipos correctos
      const dataToSend = {
        ...formData,
        etapaId: Number(formData.etapaId), // Convertir a número
        orden: Number(formData.orden) // Convertir a número
      };
      
      if (tarea) {
        result = await api.tareas.updateTarea(tarea.id, dataToSend);
      } else {
        result = await api.tareas.createTarea(dataToSend);
      }
      
      onSave(result);
    } catch (err) {
      console.error('Error al guardar tarea:', err);
      // Manejar el formato de error del backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al guardar la tarea');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>
        {tarea ? 'Editar Tarea' : 'Crear Nueva Tarea'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Orden"
                name="orden"
                type="number"
                value={formData.orden}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Inicio"
                name="fechaInicio"
                type="date"
                value={formData.fechaInicio || ''}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Fin Estimada"
                name="fechaFinEstimada"
                type="date"
                value={formData.fechaFinEstimada || ''}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_progreso">En Progreso</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Prioridad</InputLabel>
                <Select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  label="Prioridad"
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {error && (
  <Alert severity="error" sx={{ mt: 2 }}>
    {typeof error === 'string' 
      ? error 
      : Array.isArray(error) 
        ? error.join(', ') 
        : 'Error al guardar la tarea'}
  </Alert>
)}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : tarea ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

// Componente principal
const ProyectoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proyecto, setProyecto] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para formularios y diálogos
  const [etapaFormOpen, setEtapaFormOpen] = useState(false);
  const [currentEtapa, setCurrentEtapa] = useState(null);
  const [tareaFormOpen, setTareaFormOpen] = useState(false);
  const [currentTarea, setCurrentTarea] = useState(null);
  const [currentEtapaId, setCurrentEtapaId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: null, id: null });

  // Cargar los datos del proyecto
  const fetchProyecto = async () => {
    setLoading(true);
    try {
      const data = await api.proyectos.getProyecto(id);
      setProyecto(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el proyecto:', err);
      setError('No se pudo cargar la información del proyecto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyecto();
  }, [id]);

  // Manejar cambio de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abrir formulario de etapa
  const handleOpenEtapaForm = (etapa = null) => {
    setCurrentEtapa(etapa);
    setEtapaFormOpen(true);
  };

  // Abrir formulario de tarea
  const handleOpenTareaForm = (etapaId, tarea = null) => {
    setCurrentEtapaId(etapaId);
    setCurrentTarea(tarea);
    setTareaFormOpen(true);
  };

  // Guardar etapa
  const handleSaveEtapa = async () => {
    await fetchProyecto();
    setEtapaFormOpen(false);
  };

  // Guardar tarea
  const handleSaveTarea = async () => {
    await fetchProyecto();
    setTareaFormOpen(false);
  };

  // Abrir diálogo de confirmación para eliminar
  const handleDeleteConfirm = (type, id) => {
    setItemToDelete({ type, id });
    setDeleteConfirmOpen(true);
  };

  // Eliminar elemento (etapa o tarea)
  const handleDelete = async () => {
    const { type, id } = itemToDelete;
    
    try {
      if (type === 'etapa') {
        await api.etapas.deleteEtapa(id);
      } else if (type === 'tarea') {
        await api.tareas.deleteTarea(id);
      }
      
      await fetchProyecto();
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error(`Error al eliminar ${type}:`, err);
      // Aquí podrías mostrar una alerta de error
    }
  };

  // Función para mostrar el estado con color
  const getEstadoChip = (estado) => {
    const config = {
      planificacion: { color: 'info', label: 'Planificación' },
      ejecucion: { color: 'primary', label: 'Ejecución' },
      pausado: { color: 'warning', label: 'Pausado' },
      finalizado: { color: 'success', label: 'Finalizado' },
      cancelado: { color: 'error', label: 'Cancelado' },
      pendiente: { color: 'default', label: 'Pendiente' },
      en_progreso: { color: 'primary', label: 'En Progreso' },
      completada: { color: 'success', label: 'Completada' }
    };
    
    const { color, label } = config[estado] || { color: 'default', label: estado };
    
    return <Chip size="small" color={color} label={label} />;
  };

  // Función para mostrar la prioridad con color
  const getPrioridadChip = (prioridad) => {
    const config = {
      baja: { color: 'success', label: 'Baja' },
      media: { color: 'warning', label: 'Media' },
      alta: { color: 'error', label: 'Alta' }
    };
    
    const { color, label } = config[prioridad] || { color: 'default', label: prioridad };
    
    return <Chip size="small" variant="outlined" color={color} label={label} />;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
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
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/proyectos')} 
          sx={{ mt: 2 }}
        >
          Volver a Proyectos
        </Button>
      </Box>
    );
  }

  if (!proyecto) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se encontró el proyecto</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/proyectos')} 
          sx={{ mt: 2 }}
        >
          Volver a Proyectos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabecera */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/proyectos')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {proyecto.nombre}
        </Typography>
      </Box>
      
      {/* Información general del proyecto */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Código: {proyecto.codigo}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Descripción:</strong> {proyecto.descripcion || 'Sin descripción'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Ubicación:</strong> {proyecto.ubicacion}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                {getEstadoChip(proyecto.estado)}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Prioridad
                </Typography>
                {getPrioridadChip(proyecto.prioridad)}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Presupuesto
                </Typography>
                <Typography variant="h6">
                  ${Number(proyecto.presupuestoTotal).toLocaleString('es-AR')}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', mt: 2, gap: 4 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Inicio
                </Typography>
                <Typography>
                  {formatDate(proyecto.fechaInicio)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fin Estimado
                </Typography>
                <Typography>
                  {formatDate(proyecto.fechaFinEstimada)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fin Real
                </Typography>
                <Typography>
                  {formatDate(proyecto.fechaFinReal)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Pestañas */}
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Etapas y Tareas" />
            <Tab label="Asignaciones" />
            <Tab label="Documentos" />
            <Tab label="Notas" />
          </Tabs>
        </Paper>
      </Box>
      
      {/* Contenido de las pestañas */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Etapas del Proyecto</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenEtapaForm()}
          >
            Nueva Etapa
          </Button>
        </Box>
        
        {proyecto.etapas && proyecto.etapas.length > 0 ? (
          proyecto.etapas
            .sort((a, b) => a.orden - b.orden)
            .map((etapa) => (
              <Paper key={etapa.id} sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="h6">
                      {etapa.orden}. {etapa.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {getEstadoChip(etapa.estado)}
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Avance: {etapa.avance}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Editar Etapa">
                      <IconButton
                        color="inherit"
                        onClick={() => handleOpenEtapaForm(etapa)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Etapa">
                      <IconButton
                        color="inherit"
                        onClick={() => handleDeleteConfirm('etapa', etapa.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {etapa.descripcion || 'Sin descripción'}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Presupuesto
                      </Typography>
                      <Typography variant="body1">
                        ${Number(etapa.presupuesto).toLocaleString('es-AR')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha Inicio
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(etapa.fechaInicio)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha Fin Estimada
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(etapa.fechaFinEstimada)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Tareas ({etapa.tareas ? etapa.tareas.length : 0})
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleOpenTareaForm(etapa.id)}
                    >
                      Agregar Tarea
                    </Button>
                  </Box>
                  
                  {etapa.tareas && etapa.tareas.length > 0 ? (
                    <Grid container spacing={2}>
                      {etapa.tareas
                        .sort((a, b) => a.orden - b.orden)
                        .map((tarea) => (
                        <Grid item xs={12} sm={6} md={4} key={tarea.id}>
                          <Card sx={{ height: '100%' }}>
                            <CardHeader
                              title={`${tarea.orden}. ${tarea.nombre}`}
                              subheader={
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                  {getEstadoChip(tarea.estado)}
                                  {getPrioridadChip(tarea.prioridad)}
                                </Box>
                              }
                            />
                            <CardContent sx={{ pt: 0 }}>
                              <Typography variant="body2" color="text.secondary">
                                {tarea.descripcion || 'Sin descripción'}
                              </Typography>
                              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <AccessTime fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {formatDate(tarea.fechaInicio)} - {formatDate(tarea.fechaFinEstimada)}
                                </Typography>
                              </Box>
                            </CardContent>
                            <CardActions>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenTareaForm(etapa.id, tarea)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteConfirm('tarea', tarea.id)}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">
                      No hay tareas en esta etapa
                    </Typography>
                  )}
                </Box>
              </Paper>
            ))
        ) : (
          <Alert severity="info">
            Este proyecto no tiene etapas definidas. Agrega una etapa para comenzar a planificar.
          </Alert>
        )}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Group sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5">Asignaciones</Typography>
        </Box>
        <Alert severity="info">
          Esta funcionalidad estará disponible próximamente. Aquí podrás gestionar las asignaciones de personal al proyecto.
        </Alert>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Description sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5">Documentos</Typography>
        </Box>
        <Alert severity="info">
          Esta funcionalidad estará disponible próximamente. Aquí podrás gestionar los documentos relacionados con el proyecto.
        </Alert>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Comment sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5">Notas</Typography>
        </Box>
        <Alert severity="info">
          Esta funcionalidad estará disponible próximamente. Aquí podrás gestionar las notas y comentarios del proyecto.
        </Alert>
      </TabPanel>
      
      {/* Diálogo para crear/editar etapa */}
      <Dialog
        open={etapaFormOpen}
        onClose={() => setEtapaFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <EtapaForm
          etapa={currentEtapa}
          proyectoId={id}
          onClose={() => setEtapaFormOpen(false)}
          onSave={handleSaveEtapa}
        />
      </Dialog>
      
      {/* Diálogo para crear/editar tarea */}
      <Dialog
        open={tareaFormOpen}
        onClose={() => setTareaFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <TareaForm
          tarea={currentTarea}
          etapaId={currentEtapaId}
          onClose={() => setTareaFormOpen(false)}
          onSave={handleSaveTarea}
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
            ¿Está seguro de que desea eliminar {itemToDelete.type === 'etapa' ? 'esta etapa' : 'esta tarea'}?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProyectoDetallePage;