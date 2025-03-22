// src/pages/ProveedoresMaterialPage.js

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
  Check as CheckIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import api from '../services/api';

// Componente para el formulario de relación material-proveedor
const MaterialProveedorForm = ({ material, relacion, onClose, onSave }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    materialId: material ? material.id : '',
    proveedorId: '',
    precio: '',
    unidadMedida: material ? material.unidadMedida : '',
    tiempoEntrega: '',
    cantidadMinima: '',
    observaciones: '',
    esProveedorPrincipal: false,
    ...relacion
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cargar lista de proveedores disponibles
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await api.proveedores.getProveedores();
        setProveedores(data);
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
        setError('No se pudieron cargar los proveedores. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = e.target.type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
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
        {relacion ? 'Editar Proveedor para Material' : 'Añadir Proveedor para Material'}
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
                Material: {material.nombre} ({material.codigo})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio de referencia: ${Number(material.precioReferencia).toLocaleString('es-AR')} / {material.unidadMedida}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Proveedor</InputLabel>
                <Select
                  name="proveedorId"
                  value={formData.proveedorId}
                  onChange={handleChange}
                  label="Proveedor"
                  required
                  disabled={relacion !== null}
                >
                  {proveedores.map(proveedor => (
                    <MenuItem key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre} {proveedor.nombreComercial ? `(${proveedor.nombreComercial})` : ''}
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
               label="Proveedor Principal para este Material"
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
const ProveedoresMaterialPage = () => {
 const { id: materialId } = useParams();
 const navigate = useNavigate();
 
 const [material, setMaterial] = useState(null);
 const [comparativa, setComparativa] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 
 const [formDialogOpen, setFormDialogOpen] = useState(false);
 const [currentRelacion, setCurrentRelacion] = useState(null);
 const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
 const [relacionToDelete, setRelacionToDelete] = useState(null);

 // Cargar datos del material y sus proveedores
 const fetchData = async () => {
   setLoading(true);
   try {
     // Cargar información del material
     const materialData = await api.materiales.getMaterial(materialId);
     setMaterial(materialData);
     
     // Cargar comparativa de proveedores
     const comparativaData = await api.materialesProveedores.getComparativaProveedores(materialId);
     setComparativa(comparativaData);
     
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
 }, [materialId]);

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

 // Navegar a la página de materiales
 const handleBack = () => {
   navigate('/materiales');
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
         Volver a Materiales
       </Button>
     </Box>
   );
 }

 if (!material) {
   return (
     <Box sx={{ p: 3 }}>
       <Alert severity="warning">No se encontró el material</Alert>
       <Button 
         startIcon={<ArrowBackIcon />} 
         onClick={handleBack} 
         sx={{ mt: 2 }}
       >
         Volver a Materiales
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
           Proveedores para Material: {material.nombre}
         </Typography>
         <Typography variant="body1" color="text.secondary">
           Código: {material.codigo} | Categoría: {material.categoria}
         </Typography>
       </Box>
       <Button
         variant="contained"
         startIcon={<AddIcon />}
         onClick={() => handleOpenForm()}
       >
         Añadir Proveedor
       </Button>
     </Box>

     {/* Información del material */}
     <Paper sx={{ p: 3, mb: 3 }}>
       <Typography variant="h6" gutterBottom>
         Información del Material
       </Typography>
       <Grid container spacing={2}>
         <Grid item xs={12} sm={6}>
           <Typography variant="body2" color="text.secondary">
             Descripción
           </Typography>
           <Typography variant="body1">
             {material.descripcion || 'Sin descripción'}
           </Typography>
         </Grid>
         <Grid item xs={12} sm={6}>
           <Typography variant="body2" color="text.secondary">
             Precio de Referencia
           </Typography>
           <Typography variant="h5">
             ${Number(material.precioReferencia).toLocaleString('es-AR')} / {material.unidadMedida}
           </Typography>
         </Grid>
         {material.stockMinimo && (
           <Grid item xs={12} sm={6}>
             <Typography variant="body2" color="text.secondary">
               Stock Mínimo
             </Typography>
             <Typography variant="body1">
               {Number(material.stockMinimo).toLocaleString('es-AR')} {material.unidadMedida}
             </Typography>
           </Grid>
         )}
       </Grid>
     </Paper>

     {/* Comparativa de proveedores */}
     <Paper sx={{ p: 3, mb: 3 }}>
       <Typography variant="h6" gutterBottom>
         Comparativa de Proveedores
       </Typography>
       
       {!comparativa || comparativa.proveedores.length === 0 ? (
         <Alert severity="info" sx={{ mt: 2 }}>
           No hay proveedores registrados para este material todavía.
         </Alert>
       ) : (
         <TableContainer component={Paper} sx={{ mt: 2 }}>
           <Table>
             <TableHead>
               <TableRow>
                 <TableCell>Proveedor</TableCell>
                 <TableCell>Precio</TableCell>
                 <TableCell>Diferencia</TableCell>
                 <TableCell>Tiempo de Entrega</TableCell>
                 <TableCell>Cantidad Mínima</TableCell>
                 <TableCell>Principal</TableCell>
                 <TableCell>Acciones</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {comparativa.proveedores.map((item) => {
                 const proveedor = item.proveedor;
                 const esMasBarato = item.diferenciaPrecioRef < 0;
                 
                 return (
                   <TableRow key={item.id}>
                     <TableCell>
                       <Box>
                         <Typography variant="body2">{proveedor.nombre}</Typography>
                         {proveedor.nombreComercial && (
                           <Typography variant="caption" color="text.secondary">
                             {proveedor.nombreComercial}
                           </Typography>
                         )}
                       </Box>
                     </TableCell>
                     <TableCell>
                       ${Number(item.precio).toLocaleString('es-AR')} / {item.unidadMedida}
                     </TableCell>
                     <TableCell>
                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Typography 
                           variant="body2"
                           color={esMasBarato ? 'success.main' : 'error.main'}
                         >
                           {esMasBarato ? '-' : '+'}${Math.abs(Number(item.diferenciaPrecioRef)).toLocaleString('es-AR')}
                         </Typography>
                         <Chip
                           size="small"
                           label={`${esMasBarato ? '-' : '+'}${Math.abs(Number(item.porcentajeDiferencia)).toFixed(2)}%`}
                           color={esMasBarato ? 'success' : 'error'}
                           variant="outlined"
                           sx={{ ml: 1 }}
                         />
                       </Box>
                     </TableCell>
                     <TableCell>
                       {item.tiempoEntrega || 'No especificado'}
                     </TableCell>
                     <TableCell>
                       {item.cantidadMinima ? 
                         `${Number(item.cantidadMinima).toLocaleString('es-AR')} ${item.unidadMedida}` : 
                         'No especificado'}
                     </TableCell>
                     <TableCell>
                       {item.esProveedorPrincipal ? (
                         <CheckIcon color="success" />
                       ) : (
                         <ClearIcon color="disabled" />
                       )}
                     </TableCell>
                     <TableCell>
                       <Box sx={{ display: 'flex' }}>
                         <Tooltip title="Ver Proveedor">
                           <IconButton
                             size="small"
                             onClick={() => navigate(`/proveedores/${proveedor.id}`)}
                           >
                             <VisibilityIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Editar Relación">
                           <IconButton
                             size="small"
                             onClick={() => handleOpenForm(item)}
                           >
                             <EditIcon fontSize="small" />
                           </IconButton>
                         </Tooltip>
                         <Tooltip title="Eliminar Relación">
                           <IconButton
                             size="small"
                             color="error"
                             onClick={() => handleDeleteConfirm(item)}
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
       <MaterialProveedorForm
         material={material}
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
           ¿Está seguro de que desea eliminar la relación con el proveedor "{relacionToDelete?.proveedor?.nombre}"?
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

export default ProveedoresMaterialPage;