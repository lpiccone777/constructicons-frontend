// src/pages/MaterialesProveedorPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import api from '../services/api';

// Componente para el formulario de relación material-proveedor
const ProveedorMaterialForm = ({ proveedor, relacion, onClose, onSave }) => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    materialId: '',
    proveedorId: proveedor ? proveedor.id : '',
    precio: '',
    unidadMedida: '',
    tiempoEntrega: '',
    cantidadMinima: '',
    observaciones: '',
    esProveedorPrincipal: false,
    ...relacion
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar lista de materiales disponibles
  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const data = await api.materiales.getMateriales();
        setMateriales(data);
      } catch (err) {
        console.error('Error al cargar materiales:', err);
        setError('No se pudieron cargar los materiales. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = e.target.type === 'checkbox' ? checked : value;
    
    // Si cambia el material, actualizar unidad de medida
    if (name === 'materialId') {
      const material = materiales.find(m => m.id === parseInt(value));
      if (material) {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value),
          unidadMedida: material.unidadMedida
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: val
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        materialId: parseInt(formData.materialId),
        proveedorId: parseInt(formData.proveedorId)
      };

      let result;
      if (relacion) {
        // Actualizar relación existente
        result = await api.materialesProveedores.updateMaterialProveedor(relacion.id, dataToSend);
      } else {
        // Crear nueva relación
        result = await api.materialesProveedores.createMaterialProveedor(dataToSend);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar relación:', err);
      setError(err.response?.data?.message || 'Error al guardar la relación material-proveedor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {relacion ? 'Editar Material para Proveedor' : 'Añadir Material para Proveedor'}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Proveedor: {proveedor.nombre} {proveedor.nombreComercial ? `(${proveedor.nombreComercial})` : ''}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Material</InputLabel>
                <Select
                  name="materialId"
                  value={formData.materialId}
                  onChange={handleChange}
                  label="Material"
                  required
                  disabled={relacion !== null}
                >
                  {materiales.map(material => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.nombre} ({material.codigo}) - ${Number(material.precioReferencia).toLocaleString('es-AR')} / {material.unidadMedida}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="precio"
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="unidadMedida"
                label="Unidad de Medida"
                value={formData.unidadMedida}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="tiempoEntrega"
                label="Tiempo de Entrega"
                value={formData.tiempoEntrega || ''}
                onChange={handleChange}
                placeholder="Ej: 2-3 días"
                fullWidth
                margin="dense"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="cantidadMinima"
                label="Cantidad Mínima"
                type="number"
                value={formData.cantidadMinima || ''}
                onChange={handleChange}
                fullWidth
                inputProps={{ min: 0, step: "0.01" }}
                margin="dense"
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
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.esProveedorPrincipal || false}
                    onChange={handleChange}
                    name="esProveedorPrincipal"
                  />
                }
                label="Marcar como Proveedor Principal para este Material"
              />
            </Grid>
          </Grid>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting || loading}
        >
          {submitting ? 'Guardando...' : relacion ? 'Actualizar' : 'Añadir'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const MaterialesProveedorPage = () => {
  const { id: proveedorId } = useParams();
  const navigate = useNavigate();
  
  const [proveedor, setProveedor] = useState(null);
  const [materialesProveedor, setMaterialesProveedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentRelacion, setCurrentRelacion] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [relacionToDelete, setRelacionToDelete] = useState(null);

  // Cargar datos del proveedor y sus materiales
  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar información del proveedor
      const proveedorData = await api.proveedores.getProveedor(proveedorId);
      setProveedor(proveedorData);
      
      // Cargar materiales del proveedor
      const materialesData = await api.materialesProveedores.getMaterialesProveedores(undefined, proveedorId);
      setMaterialesProveedor(materialesData);
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [proveedorId]);

  // Manejar apertura del formulario
  const handleOpenForm = (relacion = null) => {
    setCurrentRelacion(relacion);
    setFormDialogOpen(true);
  };

  // Manejar guardado de relación
  const handleSaveRelacion = async () => {
    await fetchData();
    setFormDialogOpen(false);
  };

  // Manejar confirmación de eliminación
  const handleDeleteConfirm = (relacion) => {
    setRelacionToDelete(relacion);
    setDeleteConfirmOpen(true);
  };

  // Manejar eliminación de relación
  const handleDeleteRelacion = async () => {
    try {
      await api.materialesProveedores.deleteMaterialProveedor(relacionToDelete.id);
      await fetchData();
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Error al eliminar relación:', err);
      setError('Error al eliminar la relación. Por favor, intente nuevamente.');
    }
  };

  // Navegar a la página de proveedores
  const handleBack = () => {
    navigate('/proveedores');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ mt: 2 }}
        >
          Volver a Proveedores
        </Button>
      </Box>
    );
  }

  if (!proveedor) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">No se encontró el proveedor</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ mt: 2 }}
        >
          Volver a Proveedores
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabecera */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1">
            Materiales ofrecidos por: {proveedor.nombre}
          </Typography>
          {proveedor.nombreComercial && (
            <Typography variant="body1" color="text.secondary">
              Nombre Comercial: {proveedor.nombreComercial}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Añadir Material
        </Button>
      </Box>

      {/* Información del proveedor */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información del Proveedor
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Código
            </Typography>
            <Typography variant="body1">
              {proveedor.codigo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Documento
            </Typography>
            <Typography variant="body1">
              {proveedor.tipoDocumento}: {proveedor.numeroDocumento}
            </Typography>
          </Grid>
          {proveedor.condicionesPago && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Condiciones de Pago
              </Typography>
              <Typography variant="body1">
                {proveedor.condicionesPago}
              </Typography>
            </Grid>
          )}
          {proveedor.descuento && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Descuento Estándar
              </Typography>
              <Typography variant="body1">
                {Number(proveedor.descuento).toLocaleString('es-AR')}%
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Lista de materiales */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Materiales Ofrecidos
        </Typography>
        
        {materialesProveedor.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay materiales registrados para este proveedor todavía.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Precio Ref.</TableCell>
                  <TableCell>Diferencia</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialesProveedor.map((relacion) => {
                  const material = relacion.material;
                  const diferenciaValor = Number(relacion.precio) - Number(material.precioReferencia);
                  const porcentajeDiferencia = (diferenciaValor / Number(material.precioReferencia)) * 100;
                  const esMasBarato = diferenciaValor < 0;
                  
                  return (
                    <TableRow key={relacion.id}>
                      <TableCell>{material.codigo}</TableCell>
                      <TableCell>{material.nombre}</TableCell>
                      <TableCell>{material.categoria}</TableCell>
                      <TableCell>
                        ${Number(relacion.precio).toLocaleString('es-AR')} / {relacion.unidadMedida}
                      </TableCell>
                      <TableCell>
                        ${Number(material.precioReferencia).toLocaleString('es-AR')} / {material.unidadMedida}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`${esMasBarato ? '-' : '+'}${Math.abs(porcentajeDiferencia).toFixed(2)}%`}
                          color={esMasBarato ? 'success' : 'error'}
                          variant="outlined"
                        />
</TableCell>
                     <TableCell>
                       <Box sx={{ display: 'flex' }}>
                         <Tooltip title="Ver Material">
                           <IconButton
                             size="small"
                             onClick={() => navigate(`/materiales/${material.id}`)}
                           >
                             <VisibilityIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Editar Relación">
                           <IconButton
                             size="small"
                             onClick={() => handleOpenForm(relacion)}
                           >
                             <EditIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Eliminar Relación">
                           <IconButton
                             size="small"
                             color="error"
                             onClick={() => handleDeleteConfirm(relacion)}
                           >
                             <DeleteIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                       </Box>
                     </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
           </Table>
         </TableContainer>
       )}
     </Paper>

     {/* Diálogo para crear/editar relación */}
     <Dialog
       open={formDialogOpen}
       onClose={() => setFormDialogOpen(false)}
       maxWidth="md"
       fullWidth
     >
       <ProveedorMaterialForm
         proveedor={proveedor}
         relacion={currentRelacion}
         onClose={() => setFormDialogOpen(false)}
         onSave={handleSaveRelacion}
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
           ¿Está seguro de que desea eliminar la relación con el material "{relacionToDelete?.material?.nombre}"?
           Esta acción no se puede deshacer.
         </Typography>
       </DialogContent>
       <DialogActions>
         <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
         <Button onClick={handleDeleteRelacion} color="error" variant="contained">
           Eliminar
         </Button>
       </DialogActions>
     </Dialog>
   </Box>
 );
};

export default MaterialesProveedorPage;