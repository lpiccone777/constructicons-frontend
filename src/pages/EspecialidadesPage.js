// pages/EspecialidadesPage.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EspecialidadForm = ({ especialidad, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    valorHoraBase: '',
    ...especialidad,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let result;
      if (especialidad) {
        result = await api.especialidades.updateEspecialidad(especialidad.id, formData);
      } else {
        result = await api.especialidades.createEspecialidad(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar especialidad:', err);
      setError(err.response?.data?.message || 'Error al guardar la especialidad.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{especialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Código"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              fullWidth
              required
              helperText="Ej: ESP-001"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Descripción"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Valor Hora Base"
              name="valorHoraBase"
              type="number"
              value={formData.valorHoraBase}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: <span>$</span>,
                inputProps: { min: 0, step: '0.01' },
              }}
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : especialidad ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

const EspecialidadesPage = ({ asignarA }) => {
  const { id: entidadId } = useParams();
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentEspecialidad, setCurrentEspecialidad] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [especialidadToDelete, setEspecialidadToDelete] = useState(null);

  const fetchEspecialidades = async () => {
    setLoading(true);
    try {
      const data = await api.especialidades.getEspecialidades();
      setEspecialidades(data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar las especialidades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const filteredEspecialidades = useMemo(() => {
    return especialidades.filter((esp) => {
      const term = searchTerm.toLowerCase();
      return (
        esp.nombre.toLowerCase().includes(term) ||
        esp.codigo.toLowerCase().includes(term) ||
        (esp.descripcion && esp.descripcion.toLowerCase().includes(term))
      );
    });
  }, [especialidades, searchTerm]);

  const handleAsignarEspecialidad = async (especialidadId) => {
    try {
      await api[`asignacionEspecialidad${asignarA === 'etapa' ? 'Etapa' : 'Tarea'}`].createAsignacion({
        especialidadId,
        [`${asignarA}Id`]: Number(entidadId),
      });
      navigate(-1);
    } catch (err) {
      setError('Error al realizar la asignación.');
    }
  };

  const handleOpenForm = (especialidad = null) => {
    setCurrentEspecialidad(especialidad);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSaveEspecialidad = async () => {
    await fetchEspecialidades();
    setOpenForm(false);
  };

  const handleDeleteConfirm = (especialidad) => {
    setEspecialidadToDelete(especialidad);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteEspecialidad = async () => {
    try {
      await api.especialidades.deleteEspecialidad(especialidadToDelete.id);
      fetchEspecialidades();
      setDeleteConfirmOpen(false);
      setEspecialidadToDelete(null);
    } catch (err) {
      console.error('Error al eliminar especialidad:', err);
      setError('Error al eliminar la especialidad.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {asignarA ? 'Asignar Especialidad' : 'Gestión de Especialidades'}
        </Typography>
        {!asignarA && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Nueva Especialidad
          </Button>
        )}
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar especialidad..."
          variant="outlined"
          size="small"
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
      </Paper>
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredEspecialidades.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron especialidades.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredEspecialidades.map((esp) => (
            <Grid item xs={12} sm={6} md={4} key={esp.id}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" component="div">
                  {esp.nombre}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Código: {esp.codigo}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {esp.descripcion || 'Sin descripción'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor Hora: ${Number(esp.valorHoraBase).toLocaleString('es-AR')}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  {asignarA ? (
                    <Button variant="contained" color="primary" onClick={() => handleAsignarEspecialidad(esp.id)}>
                      Asignar
                    </Button>
                  ) : (
                    <>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenForm(esp)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDeleteConfirm(esp)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <EspecialidadForm
          especialidad={currentEspecialidad}
          onClose={handleCloseForm}
          onSave={handleSaveEspecialidad}
        />
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar la especialidad "{especialidadToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteEspecialidad} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EspecialidadesPage;