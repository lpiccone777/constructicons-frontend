import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  InputAdornment,
  CircularProgress, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componente para el formulario de creación/edición
const ProyectoForm = ({ proyecto, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    presupuestoTotal: '',
    estado: 'planificacion',
    prioridad: 'media',
    ...proyecto
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (proyecto) {
        // Actualizar proyecto existente
        result = await api.proyectos.updateProyecto(proyecto.id, formData);
      } else {
        // Crear nuevo proyecto
        result = await api.proyectos.createProyecto(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
      setError(err.response?.data?.message || 'Error al guardar el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {proyecto ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="codigo"
              label="Código"
              value={formData.codigo}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              helperText="Ej: PROJ-2025-001"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="ubicacion"
              label="Ubicación"
              value={formData.ubicacion}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="fechaInicio"
              label="Fecha de Inicio"
              type="date"
              value={formData.fechaInicio || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="fechaFinEstimada"
              label="Fecha de Fin Estimada"
              type="date"
              value={formData.fechaFinEstimada || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="presupuestoTotal"
              label="Presupuesto Total"
              type="number"
              value={formData.presupuestoTotal}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                label="Estado"
              >
                <MenuItem value="planificacion">Planificación</MenuItem>
                <MenuItem value="ejecucion">Ejecución</MenuItem>
                <MenuItem value="pausado">Pausado</MenuItem>
                <MenuItem value="finalizado">Finalizado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="dense">
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
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Guardando...' : proyecto ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const ProyectosPage = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentProyecto, setCurrentProyecto] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [proyectoToDelete, setProyectoToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Función para cargar los proyectos
  const fetchProyectos = async () => {
    setLoading(true);
    try {
      const data = await api.proyectos.getProyectos();
      setProyectos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError('No se pudieron cargar los proyectos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar proyectos al montar el componente
  useEffect(() => {
    fetchProyectos();
  }, []);

  // Filtrar proyectos según búsqueda y filtro de estado
  const filteredProyectos = useMemo(() => {
    return proyectos.filter(proyecto => {
      const matchesSearch = 
        proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proyecto.descripcion && proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesEstado = filterEstado ? proyecto.estado === filterEstado : true;
      
      return matchesSearch && matchesEstado;
    });
  }, [proyectos, searchTerm, filterEstado]);

  // Manejar apertura del formulario para crear o editar
  const handleOpenForm = (proyecto = null) => {
    setCurrentProyecto(proyecto);
    setOpenForm(true);
  };

  // Manejar guardado de proyecto
  const handleSaveProyecto = async (proyecto) => {
    await fetchProyectos();
    setOpenForm(false);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = (proyecto) => {
    setProyectoToDelete(proyecto);
    setDeleteConfirmOpen(true);
  };

  // Manejar eliminación de proyecto
  const handleDeleteProyecto = async () => {
    try {
      await api.proyectos.deleteProyecto(proyectoToDelete.id);
      await fetchProyectos();
      setDeleteConfirmOpen(false);
      setProyectoToDelete(null);
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      // Podrías mostrar una alerta de error aquí
    }
  };

  // Función para navegar al detalle del proyecto
  const handleViewProyecto = (id) => {
    navigate(`/proyectos/${id}`);
  };

  // Función para mostrar el chip de estado con color
  const getEstadoChip = (estado) => {
    const config = {
      planificacion: { color: 'info', label: 'Planificación' },
      ejecucion: { color: 'primary', label: 'Ejecución' },
      pausado: { color: 'warning', label: 'Pausado' },
      finalizado: { color: 'success', label: 'Finalizado' },
      cancelado: { color: 'error', label: 'Cancelado' }
    };
    
    const { color, label } = config[estado] || { color: 'default', label: estado };
    
    return <Chip size="small" color={color} label={label} />;
  };

  // Función para mostrar el chip de prioridad
  const getPrioridadChip = (prioridad) => {
    const config = {
      baja: { color: 'success', label: 'Baja' },
      media: { color: 'warning', label: 'Media' },
      alta: { color: 'error', label: 'Alta' }
    };
    
    const { color, label } = config[prioridad] || { color: 'default', label: prioridad };
    
    return <Chip size="small" variant="outlined" color={color} label={label} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Proyectos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Proyecto
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar proyectos..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              id="estado-filter"
              value={filterEstado}
              label="Estado"
              onChange={(e) => setFilterEstado(e.target.value)}
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
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredProyectos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron proyectos</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredProyectos.map((proyecto) => (
            <Grid item xs={12} key={proyecto.id}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {proyecto.nombre}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {proyecto.codigo}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {proyecto.descripcion || 'Sin descripción'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getEstadoChip(proyecto.estado)}
                    {getPrioridadChip(proyecto.prioridad)}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Presupuesto: ${Number(proyecto.presupuestoTotal).toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewProyecto(proyecto.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton 
                      color="secondary"
                      onClick={() => handleOpenForm(proyecto)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteConfirm(proyecto)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo para crear/editar proyecto */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <ProyectoForm 
          proyecto={currentProyecto} 
          onClose={() => setOpenForm(false)} 
          onSave={handleSaveProyecto} 
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
            ¿Estás seguro de que deseas eliminar el proyecto "{proyectoToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteProyecto} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProyectosPage;