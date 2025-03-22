import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../services/api';

const MaterialDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const data = await api.materiales.getMaterial(id);
        setMaterial(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos del material:', err);
        setError('No se pudo cargar la información del material. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMaterial();
  }, [id]);
  
  const handleEdit = () => {
    // Redirige a la página de edición o abre un modal para editar
    navigate(`/materiales/${id}/edit`);
  };
  
  const handleDelete = async () => {
    try {
      await api.materiales.deleteMaterial(id);
      navigate('/materiales');
    } catch (err) {
      console.error('Error al eliminar el material:', err);
      setError(err.response?.data?.message || 'Error al eliminar el material.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/materiales')}
        >
          Volver a Materiales
        </Button>
      </Box>
    );
  }
  
  if (!material) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No se encontró el material solicitado.</Alert>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/materiales')}
        >
          Volver a Materiales
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/materiales')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {material.nombre}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mr: 1 }}
            startIcon={<BusinessIcon />}
            onClick={() => navigate(`/materiales/${id}/proveedores`)}
          >
            Proveedores
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Información General
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Código:</strong> {material.codigo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Categoría:</strong> {material.categoria}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Descripción:</strong> {material.descripcion || 'Sin descripción'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Detalles de Precio y Stock
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Precio de Referencia:</strong> ${Number(material.precioReferencia).toLocaleString('es-AR')} por {material.unidadMedida}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Unidad de Medida:</strong> {material.unidadMedida}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Stock Mínimo:</strong> {material.stockMinimo ? `${Number(material.stockMinimo).toLocaleString('es-AR')} ${material.unidadMedida}` : 'No definido'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Proveedores Asociados
      </Typography>
      
      {material.proveedores && material.proveedores.length > 0 ? (
        <Grid container spacing={2}>
          {material.proveedores.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  {item.proveedor.nombre}
                </Typography>
                {item.proveedor.nombreComercial && (
                  <Typography variant="body2" color="text.secondary">
                    {item.proveedor.nombreComercial}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2">
                    Precio: ${Number(item.precio).toLocaleString('es-AR')}
                  </Typography>
                  {item.esProveedorPrincipal && (
                    <Chip 
                      label="Principal" 
                      color="primary" 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Este material no tiene proveedores asociados.
        </Alert>
      )}
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este material?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaterialDetallePage;