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
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EspecialidadForm = ({ especialidad, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    valorHoraBase: '',
    ...especialidad
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
          label="Valor Hora Base"
          name="valorHoraBase"
          type="number"
          value={formData.valorHoraBase}
          onChange={handleChange}
          fullWidth
          required
          InputProps={{
            startAdornment: <span>$</span>,
            inputProps: { min: 0, step: "0.01" }
          }}
        />
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

  const handleDeleteEspecialidad = async (id) => {
    try {
      await api.especialidades.deleteEspecialidad(id);
      fetchEspecialidades();
    } catch (err) {
      console.error('Error al eliminar especialidad:', err);
      setError('Error al eliminar la especialidad.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {asignarA ? 'Asignar Especialidad' : 'Gestión de Especialidades'}
      </Typography>

      {!asignarA && (
        <Button variant="contained" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
          Nueva Especialidad
        </Button>
      )}

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
                <TableCell>Valor Hora Base</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {especialidades.map((esp) => (
                <TableRow key={esp.id}>
                  <TableCell>{esp.id}</TableCell>
                  <TableCell>{esp.codigo}</TableCell>
                  <TableCell>{esp.nombre}</TableCell>
                  <TableCell>${Number(esp.valorHoraBase).toLocaleString('es-AR')}</TableCell>
                  <TableCell>
                    {asignarA ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAsignarEspecialidad(esp.id)}
                      >
                        Asignar
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenForm(esp)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteEspecialidad(esp.id)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <EspecialidadForm
          especialidad={currentEspecialidad}
          onClose={handleCloseForm}
          onSave={handleSaveEspecialidad}
        />
      </Dialog>
    </Box>
  );
};

export default EspecialidadesPage;
