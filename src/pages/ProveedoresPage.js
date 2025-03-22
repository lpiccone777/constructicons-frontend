import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Grid,
  Alert,
  Autocomplete,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componente para el formulario de creación/edición
const ProveedorForm = ({ proveedor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    nombreComercial: '',
    tipoDocumento: 'RFC',
    numeroDocumento: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    categorias: [],
    condicionesPago: '',
    descuento: '',
    observaciones: '',
    estado: 'activo',
    ...proveedor
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

  const handleAutocompleteChange = (name, value) => {
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
      if (proveedor) {
        // Actualizar proveedor existente
        result = await api.proveedores.updateProveedor(proveedor.id, formData);
      } else {
        // Crear nuevo proveedor
        result = await api.proveedores.createProveedor(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar proveedor:', err);
      setError(err.response?.data?.message || 'Error al guardar el proveedor.');
    } finally {
      setLoading(false);
    }
  };

  // Lista predefinida de tipos de documento
  const tiposDocumento = ['RFC', 'NIF', 'DNI', 'RUC', 'CNPJ', 'CUIT', 'Otro'];

  // Lista predefinida de categorías comunes
  const categoriasSugeridas = [
    'materiales',
    'herramientas',
    'maquinaria',
    'acabados',
    'estructurales',
    'instalaciones',
    'seguridad',
    'servicios',
    'consultoría',
    'otro'
  ];

  // Lista predefinida de condiciones de pago comunes
  const condicionesPagoComunes = [
    'Contado',
    '15 días',
    '30 días',
    '45 días',
    '60 días',
    '90 días',
    'Otro'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {proveedor ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Información básica */}
          <Grid item xs={12} sm={6}>
            <TextField
              name="codigo"
              label="Código"
              value={formData.codigo}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              helperText="Ej: PROV-2025-001"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nombre"
              label="Nombre Legal"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nombreComercial"
              label="Nombre Comercial"
              value={formData.nombreComercial || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                label="Tipo de Documento"
                required
              >
                {tiposDocumento.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="numeroDocumento"
              label="Número de Documento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
            />
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Información de Contacto
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="direccion"
              label="Dirección"
              value={formData.direccion || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="ciudad"
              label="Ciudad"
              value={formData.ciudad || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="codigoPostal"
              label="Código Postal"
              value={formData.codigoPostal || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pais"
              label="País"
              value={formData.pais || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="telefono"
              label="Teléfono"
              value={formData.telefono || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              name="sitioWeb"
              label="Sitio Web"
              value={formData.sitioWeb || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          {/* Información comercial */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Información Comercial
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="categorias"
              options={categoriasSugeridas}
              value={formData.categorias || []}
              onChange={(_, newValue) => handleAutocompleteChange('categorias', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Categorías"
                  margin="dense"
                />
              )}
              freeSolo
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Condiciones de Pago</InputLabel>
              <Select
                name="condicionesPago"
                value={formData.condicionesPago || ''}
                onChange={handleChange}
                label="Condiciones de Pago"
              >
                <MenuItem value="">No especificado</MenuItem>
                {condicionesPagoComunes.map(cond => (
                  <MenuItem key={cond} value={cond}>{cond}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="descuento"
              label="Descuento Estándar (%)"
              type="number"
              value={formData.descuento || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputProps={{
                inputProps: { min: 0, max: 100, step: "0.01" }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="observaciones"
              label="Observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                label="Estado"
                required
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
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
          {loading ? 'Guardando...' : proveedor ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [categorias, setCategorias] = useState([]);
  
  const navigate = useNavigate();

  // Función para cargar los proveedores
  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.proveedores.getProveedores(filterCategoria || undefined);
      setProveedores(data);
      
      // Extraer categorías únicas de los proveedores
      const todasCategorias = new Set();
      data.forEach(proveedor => {
        if (proveedor.categorias && proveedor.categorias.length > 0) {
          proveedor.categorias.forEach(cat => todasCategorias.add(cat));
        }
      });
      setCategorias(Array.from(todasCategorias));
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError('No se pudieron cargar los proveedores. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filterCategoria]);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    fetchProveedores();
  }, [filterCategoria, fetchProveedores]);

  // Filtrar proveedores según búsqueda
  const filteredProveedores = useMemo(() => {
    return proveedores.filter(proveedor => {
      return (
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proveedor.nombreComercial && proveedor.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proveedor.numeroDocumento && proveedor.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [proveedores, searchTerm]);

  // Manejar apertura del formulario para crear o editar
  const handleOpenForm = (proveedor = null) => {
    setCurrentProveedor(proveedor);
    setOpenForm(true);
  };

  // Manejar guardado de proveedor
  const handleSaveProveedor = async () => {
    await fetchProveedores();
    setOpenForm(false);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = (proveedor) => {
    setProveedorToDelete(proveedor);
    setDeleteConfirmOpen(true);
  };

  // Manejar eliminación de proveedor
  const handleDeleteProveedor = async () => {
    try {
      await api.proveedores.deleteProveedor(proveedorToDelete.id);
      await fetchProveedores();
      setDeleteConfirmOpen(false);
      setProveedorToDelete(null);
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      setError(err.response?.data?.message || 'Error al eliminar el proveedor.');
    }
  };

  // Función para ver detalles de un proveedor
  const handleViewProveedor = (id) => {
    navigate(`/proveedores/${id}`);
  };

  // Función para mostrar el chip de estado
  const getEstadoChip = (estado) => {
    return (
      <Chip
        label={estado === 'activo' ? 'Activo' : 'Inactivo'}
        color={estado === 'activo' ? 'success' : 'default'}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Proveedores
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Proveedor
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar proveedores..."
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
            <InputLabel id="categoria-filter-label">Categoría</InputLabel>
            <Select
              labelId="categoria-filter-label"
              id="categoria-filter"
              value={filterCategoria}
              label="Categoría"
              onChange={(e) => setFilterCategoria(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : filteredProveedores.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron proveedores</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredProveedores.map((proveedor) => (
            <Grid item xs={12} key={proveedor.id}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {proveedor.nombre}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {proveedor.codigo}
                    </Typography>
                    {getEstadoChip(proveedor.estado)}
                  </Box>
                  {proveedor.nombreComercial && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Nombre Comercial: {proveedor.nombreComercial}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {proveedor.tipoDocumento}: {proveedor.numeroDocumento}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {proveedor.categorias && proveedor.categorias.map((cat, index) => (
                      <Chip 
                        key={index} 
                        label={cat} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    Contactos: {proveedor._count?.contactos || 0}
                  </Typography>
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewProveedor(proveedor.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton 
                      color="secondary"
                      onClick={() => handleOpenForm(proveedor)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteConfirm(proveedor)}
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

      {/* Diálogo para crear/editar proveedor */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <ProveedorForm 
          proveedor={currentProveedor} 
          onClose={() => setOpenForm(false)} 
          onSave={handleSaveProveedor} 
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
            ¿Estás seguro de que deseas eliminar el proveedor "{proveedorToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteProveedor} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProveedoresPage;