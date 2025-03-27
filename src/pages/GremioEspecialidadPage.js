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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import api from '../services/api';

const GremioEspecialidadPage = () => {
  const [asociaciones, setAsociaciones] = useState([]);
  const [gremios, setGremios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    gremioId: '',
    especialidadId: '',
  });

  const fetchAsociaciones = async () => {
    try {
      const data = await api.gremioEspecialidad.getAsociaciones();
      setAsociaciones(data);
    } catch (error) {
      console.error('Error al obtener asociaciones', error);
    }
  };

  const fetchGremios = async () => {
    try {
      const data = await api.gremios.getGremios();
      setGremios(data);
    } catch (error) {
      console.error('Error al obtener gremios', error);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const data = await api.especialidades.getEspecialidades();
      setEspecialidades(data);
    } catch (error) {
      console.error('Error al obtener especialidades', error);
    }
  };

  useEffect(() => {
    fetchAsociaciones();
    fetchGremios();
    fetchEspecialidades();
  }, []);

  const handleOpenDialog = () => {
    setFormData({ gremioId: '', especialidadId: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.gremioEspecialidad.createAsociacion(formData);
      fetchAsociaciones();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al crear asociación', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.gremioEspecialidad.deleteAsociacion(id);
      fetchAsociaciones();
    } catch (error) {
      console.error('Error al eliminar asociación', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Asociación de Especialidades a Gremios
      </Typography>
      <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Agregar Asociación
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Gremio</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asociaciones.map((assoc) => {
              const gremio = gremios.find(g => g.id === assoc.gremioId);
              const especialidad = especialidades.find(e => e.id === assoc.especialidadId);
              return (
                <TableRow key={assoc.id}>
                  <TableCell>{assoc.id}</TableCell>
                  <TableCell>{gremio ? gremio.nombre : assoc.gremioId}</TableCell>
                  <TableCell>{especialidad ? especialidad.nombre : assoc.especialidadId}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(assoc.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Nueva Asociación</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="gremio-label">Gremio</InputLabel>
            <Select
              labelId="gremio-label"
              name="gremioId"
              value={formData.gremioId}
              label="Gremio"
              onChange={handleChange}
            >
              {gremios.map((gremio) => (
                <MenuItem key={gremio.id} value={gremio.id}>
                  {gremio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="especialidad-label">Especialidad</InputLabel>
            <Select
              labelId="especialidad-label"
              name="especialidadId"
              value={formData.especialidadId}
              label="Especialidad"
              onChange={handleChange}
            >
              {especialidades.map((especialidad) => (
                <MenuItem key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GremioEspecialidadPage;
