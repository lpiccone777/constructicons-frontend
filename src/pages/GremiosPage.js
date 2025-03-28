// pages/GremiosPage.js
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
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const GremioForm = ({ gremio, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    contactoNombre: '',
    contactoTelefono: '',
    contactoEmail: '',
    convenioVigente: '',
    fechaConvenio: '',
    observaciones: '',
    ...gremio,
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
      if (gremio) {
        result = await api.gremios.updateGremio(gremio.id, formData);
      } else {
        result = await api.gremios.createGremio(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar gremio:', err);
      setError(err.response?.data?.message || 'Error al guardar el gremio.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{gremio ? 'Editar Gremio' : 'Nuevo Gremio'}</DialogTitle>
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
              helperText="Ej: GRE-001"
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
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Contacto (Nombre)"
              name="contactoNombre"
              value={formData.contactoNombre || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Contacto (Teléfono)"
              name="contactoTelefono"
              value={formData.contactoTelefono || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Contacto (Email)"
              name="contactoEmail"
              type="email"
              value={formData.contactoEmail || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Convenio Vigente"
              name="convenioVigente"
              value={formData.convenioVigente || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Fecha de Convenio"
              name="fechaConvenio"
              type="date"
              value={formData.fechaConvenio || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : gremio ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

const GremiosPage = () => {
  const [gremios, setGremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentGremio, setCurrentGremio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [gremioToDelete, setGremioToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchGremios = async () => {
    setLoading(true);
    try {
      const data = await api.gremios.getGremios();
      setGremios(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar gremios:', err);
      setError('No se pudieron cargar los gremios. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGremios();
  }, []);

  const filteredGremios = useMemo(() => {
    return gremios.filter((gremio) => {
      const term = searchTerm.toLowerCase();
      return (
        gremio.nombre.toLowerCase().includes(term) ||
        gremio.codigo.toLowerCase().includes(term) ||
        (gremio.descripcion && gremio.descripcion.toLowerCase().includes(term))
      );
    });
  }, [gremios, searchTerm]);

  const handleOpenForm = (gremio = null) => {
    setCurrentGremio(gremio);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSaveGremio = async () => {
    await fetchGremios();
    setOpenForm(false);
  };

  const handleDeleteConfirm = (gremio) => {
    setGremioToDelete(gremio);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteGremio = async () => {
    try {
      await api.gremios.deleteGremio(gremioToDelete.id);
      fetchGremios();
      setDeleteConfirmOpen(false);
      setGremioToDelete(null);
    } catch (err) {
      console.error('Error al eliminar gremio:', err);
      setError('Error al eliminar el gremio.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Gremios
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Nuevo Gremio
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar gremio..."
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
      ) : filteredGremios.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron gremios.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredGremios.map((gremio) => (
            <Grid item xs={12} sm={6} md={4} key={gremio.id}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" component="div">
                  {gremio.nombre}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Código: {gremio.codigo}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {gremio.descripcion || 'Sin descripción'}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenForm(gremio)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => handleDeleteConfirm(gremio)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <GremioForm gremio={currentGremio} onClose={handleCloseForm} onSave={handleSaveGremio} />
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el gremio "{gremioToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteGremio} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GremiosPage;