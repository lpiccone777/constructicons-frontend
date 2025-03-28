// pages/EmpleadosPage.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  IconButton,
  Tooltip,
  Autocomplete, // Añadir esta importación
  Chip, // Añadir esta importación
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EmpleadoForm = ({ empleado, onClose, onSave, gremios }) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    fechaIngreso: "",
    estado: "activo",
    gremioId: "",
    observaciones: "",
    especialidades: [],
    ...empleado,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState(
    []
  );

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        // Si hay un gremio seleccionado, filtrar por ese gremio
        const params = formData.gremioId
          ? { gremioId: formData.gremioId }
          : undefined;
        const data = await api.especialidades.getEspecialidades(params);
        setEspecialidadesDisponibles(data);
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
      }
    };

    fetchEspecialidades();
  }, [formData.gremioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si cambia el gremio, limpiar las especialidades seleccionadas
    if (name === "gremioId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        especialidades: [], // Reiniciar las especialidades cuando cambia el gremio
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      console.error("Error al guardar empleado:", err);
      setError(err.response?.data?.message || "Error al guardar el empleado.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {empleado ? "Editar Empleado" : "Nuevo Empleado"}
      </DialogTitle>
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
            <Autocomplete
              multiple
              id="especialidades"
              options={especialidadesDisponibles}
              getOptionLabel={(option) => option.nombre}
              value={formData.especialidades || []}
              onChange={(event, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  especialidades: newValue,
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.nombre}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Especialidades"
                  placeholder="Seleccionar especialidades"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="gremio-label">Gremio</InputLabel>
              <Select
                labelId="gremio-label"
                name="gremioId"
                value={formData.gremioId || ""}
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
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Guardando..." : empleado ? "Actualizar" : "Crear"}
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
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);

  const fetchEmpleados = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.empleados.getEmpleados();
      setEmpleados(data);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar los empleados.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGremios = async () => {
    try {
      const data = await api.gremios.getGremios();
      setGremios(data);
    } catch (err) {
      console.error("Error al cargar gremios:", err);
    }
  };

  useEffect(() => {
    fetchEmpleados();
    fetchGremios();
  }, [fetchEmpleados]);

  const handleAsignarEmpleado = async (empleadoId) => {
    try {
      await api[
        `asignacionEmpleado${asignarA === "etapa" ? "Etapa" : "Tarea"}`
      ].createAsignacion({
        empleadoId,
        [`${asignarA}Id`]: Number(entidadId),
      });
      navigate(-1);
    } catch (err) {
      setError("Error al realizar la asignación.");
    }
  };

  const filteredEmpleados = useMemo(() => {
    return empleados.filter((emp) => {
      const term = searchTerm.toLowerCase();
      return (
        emp.nombre.toLowerCase().includes(term) ||
        emp.apellido.toLowerCase().includes(term) ||
        emp.codigo.toLowerCase().includes(term) ||
        (emp.gremio && emp.gremio.nombre.toLowerCase().includes(term)) ||
        emp.numeroDocumento.toLowerCase().includes(term)
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

  const handleDeleteConfirm = (empleado) => {
    setEmpleadoToDelete(empleado);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteEmpleado = async () => {
    try {
      await api.empleados.deleteEmpleado(empleadoToDelete.id);
      fetchEmpleados();
      setDeleteConfirmOpen(false);
      setEmpleadoToDelete(null);
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      setError("Error al eliminar el empleado.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          {asignarA ? "Asignar Empleado" : "Gestión de Empleados"}
        </Typography>
        {!asignarA && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
          >
            Nuevo Empleado
          </Button>
        )}
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Buscar empleado..."
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
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filteredEmpleados.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">No se encontraron empleados.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredEmpleados.map((empleado) => (
            <Grid item xs={12} sm={6} md={4} key={empleado.id}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography variant="h6" component="div">
                  {empleado.nombre} {empleado.apellido}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Código: {empleado.codigo}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Documento: {empleado.tipoDocumento} -{" "}
                  {empleado.numeroDocumento}
                </Typography>
                {empleado.gremio && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Gremio: {empleado.gremio.nombre}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Estado: {empleado.estado}
                </Typography>
                <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                  {asignarA ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAsignarEmpleado(empleado.id)}
                    >
                      Asignar
                    </Button>
                  ) : (
                    <>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenForm(empleado)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteConfirm(empleado)}
                        >
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
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
        <EmpleadoForm
          empleado={currentEmpleado}
          onClose={handleCloseForm}
          onSave={handleSaveEmpleado}
          gremios={gremios}
        />
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el empleado "
            {empleadoToDelete?.nombre} {empleadoToDelete?.apellido}"? Esta
            acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteEmpleado}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmpleadosPage;
