import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Alert,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EmpleadoForm = ({ empleado, onClose, onSave, gremios }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    fechaIngreso: '',
    estado: 'activo',
    gremioId: '',
    observaciones: '',
    ...empleado,
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
      if (empleado) {
        result = await api.empleados.updateEmpleado(empleado.id, formData);
      } else {
        result = await api.empleados.createEmpleado(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      setError(err.response?.data?.message || 'Error al guardar el empleado.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
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
              helperText="Ej: EMP-001"
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
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Tipo de Documento"
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Número de Documento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Código Postal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="País"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Fecha de Ingreso"
              name="fechaIngreso"
              type="date"
              value={formData.fechaIngreso}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                name="estado"
                value={formData.estado}
                label="Estado"
                onChange={handleChange}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="gremio-label">Gremio</InputLabel>
              <Select
                labelId="gremio-label"
                name="gremioId"
                value={formData.gremioId || ''}
                label="Gremio"
                onChange={handleChange}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {gremios.map((gremio) => (
                  <MenuItem key={gremio.id} value={gremio.id}>
                    {gremio.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
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
          {loading ? 'Guardando...' : empleado ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

const EmpleadosPage = ({ asignarA }) => {
  const { id: entidadId } = useParams();
  const navigate = useNavigate();
  
  const [empleados, setEmpleados] = useState([]);
  const [gremios, setGremios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.empleados.getEmpleados();
      setEmpleados(data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los empleados.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGremios = async () => {
    try {
      const data = await api.gremios.getGremios();
      setGremios(data);
    } catch (err) {
      console.error('Error al cargar gremios:', err);
    }
  };

  useEffect(() => {
    fetchEmpleados();
    fetchGremios();
  }, [fetchEmpleados]);

  const handleAsignarEmpleado = async (empleadoId) => {
    try {
      await api.asignacionEmpleadoTarea.createAsignacion({
        empleadoId,
        [`${asignarA}Id`]: Number(entidadId),
      });
      navigate(-1);
    } catch (err) {
      setError('Error al realizar la asignación.');
    }
  };

  const filteredEmpleados = useMemo(() => {
    return empleados.filter(emp => {
      const term = searchTerm.toLowerCase();
      return (
        emp.nombre.toLowerCase().includes(term) ||
        emp.apellido.toLowerCase().includes(term) ||
        emp.codigo.toLowerCase().includes(term)
      );
    });
  }, [empleados, searchTerm]);

  const handleOpenForm = (empleado = null) => {
    setCurrentEmpleado(empleado);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSaveEmpleado = async () => {
    await fetchEmpleados();
    setOpenForm(false);
  };

  const handleDeleteEmpleado = async (id) => {
    try {
      await api.empleados.deleteEmpleado(id);
      fetchEmpleados();
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
      setError('Error al eliminar el empleado.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {asignarA ? 'Asignar Empleado' : 'Gestión de Empleados'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Buscar empleado..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
          sx={{ mr: 2, flex: 1 }}
        />
        {!asignarA && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Nuevo Empleado
          </Button>
        )}
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Gremio</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmpleados.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.codigo}</TableCell>
                  <TableCell>{emp.nombre} {emp.apellido}</TableCell>
                  <TableCell>{emp.tipoDocumento}: {emp.numeroDocumento}</TableCell>
                  <TableCell>{emp.estado}</TableCell>
                  <TableCell>{emp.gremio ? emp.gremio.nombre : 'Sin asignar'}</TableCell>
                  <TableCell>
                    {asignarA ? (
                      <Button variant="contained" color="primary" onClick={() => handleAsignarEmpleado(emp.id)}>
                        Asignar
                      </Button>
                    ) : (
                      <>
                        <Button variant="outlined" onClick={() => handleOpenForm(emp)} sx={{ mr: 1 }}>
                          Editar
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteEmpleado(emp.id)}>
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
      {/* Diálogos y formularios existentes */}
    </Box>
  );
};

export default EmpleadosPage;