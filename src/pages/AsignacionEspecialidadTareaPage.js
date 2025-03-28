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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import api from '../services/api';

const AsignacionEspecialidadTareaPage = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    tareaId: '',
    especialidadId: '',
    cantidad: '',
    horasEstimadas: '',
    valorHora: '',
    costoTotal: '',
    observaciones: ''
  });

  const fetchAsignaciones = async () => {
    try {
      const data = await api.asignacionEspecialidadTarea.getAsignaciones();
      setAsignaciones(data);
    } catch (error) {
      console.error('Error al obtener asignaciones', error);
    }
  };

  const fetchTareas = async () => {
    try {
      // Suponemos que hay un endpoint para obtener todas las tareas; si es necesario, ajusta el parámetro
      const data = await api.tareas.getTareas();
      setTareas(data);
    } catch (error) {
      console.error('Error al obtener tareas', error);
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
    fetchAsignaciones();
    fetchTareas();
    fetchEspecialidades();
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      tareaId: '',
      especialidadId: '',
      cantidad: '',
      horasEstimadas: '',
      valorHora: '',
      costoTotal: '',
      observaciones: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    if (['cantidad', 'horasEstimadas', 'valorHora'].includes(name)) {
      const cantidad = parseFloat(newFormData.cantidad) || 0;
      const horas = parseFloat(newFormData.horasEstimadas) || 0;
      const valor = parseFloat(newFormData.valorHora) || 0;
      newFormData.costoTotal = cantidad * horas * valor;
    }
    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    try {
      await api.asignacionEspecialidadTarea.createAsignacion(formData);
      fetchAsignaciones();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error al crear asignación', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.asignacionEspecialidadTarea.deleteAsignacion(id);
      fetchAsignaciones();
    } catch (error) {
      console.error('Error al eliminar asignación', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Asignación de Especialidades a Tareas
      </Typography>
      <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Nueva Asignación
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tarea</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Horas Estimadas</TableCell>
              <TableCell>Valor Hora</TableCell>
              <TableCell>Costo Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asignaciones.map((asig) => {
              const tarea = tareas.find(t => t.id === asig.tareaId);
              const especialidad = especialidades.find(e => e.id === asig.especialidadId);
              return (
                <TableRow key={asig.id}>
                  <TableCell>{asig.id}</TableCell>
                  <TableCell>{tarea ? tarea.nombre : asig.tareaId}</TableCell>
                  <TableCell>{especialidad ? especialidad.nombre : asig.especialidadId}</TableCell>
                  <TableCell>{asig.cantidad}</TableCell>
                  <TableCell>{asig.horasEstimadas}</TableCell>
                  <TableCell>{asig.valorHora}</TableCell>
                  <TableCell>{asig.costoTotal}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(asig.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Asignación de Especialidad a Tarea</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="tarea-label">Tarea</InputLabel>
            <Select
              labelId="tarea-label"
              name="tareaId"
              value={formData.tareaId}
              label="Tarea"
              onChange={handleChange}
            >
              {tareas.map((tarea) => (
                <MenuItem key={tarea.id} value={tarea.id}>
                  {tarea.nombre}
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
          <TextField
            margin="dense"
            label="Cantidad"
            name="cantidad"
            type="number"
            fullWidth
            value={formData.cantidad}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Horas Estimadas"
            name="horasEstimadas"
            type="number"
            fullWidth
            value={formData.horasEstimadas}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Valor Hora"
            name="valorHora"
            type="number"
            fullWidth
            value={formData.valorHora}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Costo Total"
            name="costoTotal"
            type="number"
            fullWidth
            value={formData.costoTotal}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            label="Observaciones"
            name="observaciones"
            type="text"
            fullWidth
            value={formData.observaciones}
            onChange={handleChange}
          />
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

export default AsignacionEspecialidadTareaPage;
