import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
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
    ...gremio
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
        <TextField
          margin="dense"
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          required
        />
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
        <TextField
          margin="dense"
          label="Contacto (Nombre)"
          name="contactoNombre"
          value={formData.contactoNombre || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Contacto (Teléfono)"
          name="contactoTelefono"
          value={formData.contactoTelefono || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Contacto (Email)"
          name="contactoEmail"
          type="email"
          value={formData.contactoEmail || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Convenio Vigente"
          name="convenioVigente"
          value={formData.convenioVigente || ''}
          onChange={handleChange}
          fullWidth
        />
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

  const handleDeleteGremio = async (id) => {
    try {
      await api.gremios.deleteGremio(id);
      fetchGremios();
    } catch (err) {
      console.error('Error al eliminar gremio:', err);
      setError('Error al eliminar el gremio.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Gremios
      </Typography>
      <Button variant="contained" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
        Nuevo Gremio
      </Button>
      {loading ? (
        <Typography>Cargando...</Typography>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gremios.map((gremio) => (
                <TableRow key={gremio.id}>
                  <TableCell>{gremio.id}</TableCell>
                  <TableCell>{gremio.codigo}</TableCell>
                  <TableCell>{gremio.nombre}</TableCell>
                  <TableCell>{gremio.descripcion}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleOpenForm(gremio)} sx={{ mr: 1 }}>
                      Editar
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteGremio(gremio.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <GremioForm gremio={currentGremio} onClose={handleCloseForm} onSave={handleSaveGremio} />
      </Dialog>
    </Box>
  );
};

export default GremiosPage;
