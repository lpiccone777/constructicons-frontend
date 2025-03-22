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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componente para el formulario de creación/edición
const MaterialForm = ({ material, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    unidadMedida: '',
    precioReferencia: '',
    stockMinimo: '',
    ...material
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
      if (material) {
        // Actualizar material existente
        result = await api.materiales.updateMaterial(material.id, formData);
      } else {
        // Crear nuevo material
        result = await api.materiales.createMaterial(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar material:', err);
      setError(err.response?.data?.message || 'Error al guardar el material.');
    } finally {
      setLoading(false);
    }
  };

  // Lista predefinida de categorías comunes
  const categorias = [
    'estructurales',
    'acabados',
    'instalaciones',
    'electricidad',
    'plomería',
    'herramientas',
    'seguridad',
    'otro'
  ];

  // Lista predefinida de unidades de medida comunes
  const unidadesMedida = [
    'kg', 'g', 'ton',
    'l', 'ml',
    'm', 'cm', 'm²', 'm³',
    'unidad', 'pieza', 'caja', 'rollo',
    'bolsa', 'saco'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {material ? 'Editar Material' : 'Crear Nuevo Material'}
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
              helperText="Ej: MAT-2025-001"
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                label="Categoría"
                required
              >
                {categorias.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Unidad de Medida</InputLabel>
              <Select
                name="unidadMedida"
                value={formData.unidadMedida}
                onChange={handleChange}
                label="Unidad de Medida"
                required
              >
                {unidadesMedida.map(um => (
                  <MenuItem key={um} value={um}>{um}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="precioReferencia"
              label="Precio de Referencia"
              type="number"
              value={formData.precioReferencia}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: "0.01" }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="stockMinimo"
              label="Stock Mínimo"
              type="number"
              value={formData.stockMinimo || ''}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputProps={{
                inputProps: { min: 0, step: "0.01" }
              }}
            />
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
          {loading ? 'Guardando...' : material ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const MaterialesPage = () => {
  const [materiales, setMateriales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Función para cargar los materiales
  const fetchMateriales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.materiales.getMateriales(filterCategoria || undefined);
      setMateriales(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar materiales:', err);
      setError('No se pudieron cargar los materiales. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filterCategoria]);

  // Función para cargar las categorías
  const fetchCategorias = useCallback(async () => {
    try {
      const data = await api.materiales.getCategoriasMateriales();
      setCategorias(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  // Cargar materiales y categorías al montar el componente
  useEffect(() => {
    fetchMateriales();
    fetchCategorias();
  }, [filterCategoria, fetchMateriales, fetchCategorias]);

  // Filtrar materiales según búsqueda
  const filteredMateriales = useMemo(() => {
    return materiales.filter(material => {
      return (
        material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (material.descripcion && material.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [materiales, searchTerm]);

  // Manejar apertura del formulario para crear o editar
  const handleOpenForm = (material = null) => {
    setCurrentMaterial(material);
    setOpenForm(true);
  };

  // Manejar guardado de material
  const handleSaveMaterial = async () => {
    await fetchMateriales();
    setOpenForm(false);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = (material) => {
    setMaterialToDelete(material);
    setDeleteConfirmOpen(true);
  };

  // Manejar eliminación de material
  const handleDeleteMaterial = async () => {
    try {
      await api.materiales.deleteMaterial(materialToDelete.id);
      await fetchMateriales();
      setDeleteConfirmOpen(false);
      setMaterialToDelete(null);
    } catch (err) {
      console.error('Error al eliminar material:', err);
      setError(err.response?.data?.message || 'Error al eliminar el material.');
    }
  };

  // Función para ver detalles de un material
  const handleViewMaterial = (id) => {
    navigate(`/materiales/${id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Materiales
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Material
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar materiales..."
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
                <MenuItem key={cat.categoria} value={cat.categoria}>
                  {cat.categoria.charAt(0).toUpperCase() + cat.categoria.slice(1)}
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
      ) : filteredMateriales.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No se encontraron materiales</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredMateriales.map((material) => (
            <Grid item xs={12} key={material.id}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {material.nombre}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {material.codigo}
                    </Typography>
                    <Chip 
                      label={material.categoria} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {material.descripcion || 'Sin descripción'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Precio: ${Number(material.precioReferencia).toLocaleString('es-AR')} / {material.unidadMedida}
                    </Typography>
                    {material.stockMinimo && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        Stock Mínimo: {Number(material.stockMinimo).toLocaleString('es-AR')} {material.unidadMedida}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Ver detalles">
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewMaterial(material.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton 
                      color="secondary"
                      onClick={() => handleOpenForm(material)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteConfirm(material)}
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

      {/* Diálogo para crear/editar material */}
      <Dialog 
        open={openForm} 
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <MaterialForm 
          material={currentMaterial} 
          onClose={() => setOpenForm(false)} 
          onSave={handleSaveMaterial} 
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
            ¿Estás seguro de que deseas eliminar el material "{materialToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteMaterial} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialesPage;