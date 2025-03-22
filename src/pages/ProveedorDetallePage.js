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
  Divider,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import api from '../services/api';

// Panel de contenido para las pestañas
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proveedor-tabpanel-${index}`}
      aria-labelledby={`proveedor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Componente para el formulario de contacto
const ContactoForm = ({ contacto, proveedorId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    proveedorId: proveedorId,
    nombre: '',
    cargo: '',
    telefono: '',
    email: '',
    esPrincipal: false,
    observaciones: '',
    ...contacto
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);

    try {
      let result;
      if (contacto) {
        // Actualizar contacto existente
        result = await api.proveedores.updateContacto(contacto.id, formData);
      } else {
        // Crear nuevo contacto
        result = await api.proveedores.createContacto(formData);
      }
      onSave(result);
    } catch (err) {
      console.error('Error al guardar contacto:', err);
      setError(err.response?.data?.message || 'Error al guardar el contacto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {contacto ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="nombre"
              label="Nombre Completo"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="cargo"
              label="Cargo o Puesto"
              value={formData.cargo || ''}
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              name="observaciones"
              label="Observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.esPrincipal || false}
                  onChange={handleChange}
                  name="esPrincipal"
                />
              }
              label="Contacto Principal"
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
          {loading ? 'Guardando...' : contacto ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </form>
  );
};

// Componente principal
const ProveedorDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [proveedor, setProveedor] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactoFormOpen, setContactoFormOpen] = useState(false);
  const [currentContacto, setCurrentContacto] = useState(null);
  const [deleteContactoDialogOpen, setDeleteContactoDialogOpen] = useState(false);
  const [contactoToDelete, setContactoToDelete] = useState(null);
  
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        setLoading(true);
        const data = await api.proveedores.getProveedor(id);
        setProveedor(data);
        setContactos(data.contactos || []);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos del proveedor:', err);
        setError('No se pudo cargar la información del proveedor. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProveedor();
  }, [id]);
  
  const handleEdit = () => {
    // Redirige a la página de edición o abre un modal para editar
    navigate(`/proveedores/${id}/edit`);
  };
  
  const handleDelete = async () => {
    try {
      await api.proveedores.deleteProveedor(id);
      navigate('/proveedores');
    } catch (err) {
      console.error('Error al eliminar el proveedor:', err);
      setError(err.response?.data?.message || 'Error al eliminar el proveedor.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejo de contactos
  const handleAddContacto = () => {
    setCurrentContacto(null);
    setContactoFormOpen(true);
  };

  const handleEditContacto = (contacto) => {
    setCurrentContacto(contacto);
    setContactoFormOpen(true);
  };

  const handleDeleteContactoConfirm = (contacto) => {
    setContactoToDelete(contacto);
    setDeleteContactoDialogOpen(true);
  };

  const handleDeleteContacto = async () => {
    try {
      await api.proveedores.deleteContacto(contactoToDelete.id);
      
      // Actualizar la lista de contactos localmente
      setContactos(contactos.filter(c => c.id !== contactoToDelete.id));
      
      setDeleteContactoDialogOpen(false);
      setContactoToDelete(null);
    } catch (err) {
      console.error('Error al eliminar el contacto:', err);
      setError(err.response?.data?.message || 'Error al eliminar el contacto.');
    }
  };

  const handleSaveContacto = async () => {
    // Recargar todos los datos del proveedor para obtener los contactos actualizados
    try {
      const data = await api.proveedores.getProveedor(id);
      setProveedor(data);
      setContactos(data.contactos || []);
      setContactoFormOpen(false);
    } catch (err) {
      console.error('Error al recargar los datos del proveedor:', err);
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
          onClick={() => navigate('/proveedores')}
        >
          Volver a Proveedores
        </Button>
      </Box>
    );
  }
  
  if (!proveedor) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No se encontró el proveedor solicitado.</Alert>
        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/proveedores')}
        >
          Volver a Proveedores
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/proveedores')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {proveedor.nombre}
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
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </Box>
      </Box>

      {/* Información general */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información General
              </Typography>
              <Chip 
                label={proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'} 
                color={proveedor.estado === 'activo' ? 'success' : 'default'} 
                size="small" 
                sx={{ ml: 2 }} 
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              <strong>Código:</strong> {proveedor.codigo}
            </Typography>
            {proveedor.nombreComercial && (
              <Typography variant="body1" gutterBottom>
                <strong>Nombre Comercial:</strong> {proveedor.nombreComercial}
              </Typography>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>{proveedor.tipoDocumento}:</strong> {proveedor.numeroDocumento}
            </Typography>
            {proveedor.categorias && proveedor.categorias.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Categorías:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {proveedor.categorias.map((cat, index) => (
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
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Información de Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {proveedor.direccion ? proveedor.direccion : 'No especificada'}
                {proveedor.ciudad && `, ${proveedor.ciudad}`}
                {proveedor.codigoPostal && ` (${proveedor.codigoPostal})`}
                {proveedor.pais && `, ${proveedor.pais}`}
              </Typography>
            </Box>
            {proveedor.telefono && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1">{proveedor.telefono}</Typography>
              </Box>
            )}
            {proveedor.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body1">{proveedor.email}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        
        {(proveedor.condicionesPago || proveedor.descuento || proveedor.observaciones) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Condiciones Comerciales
                </Typography>
                {proveedor.condicionesPago && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Condiciones de Pago:</strong> {proveedor.condicionesPago}
                  </Typography>
                )}
                {proveedor.descuento && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Descuento Estándar:</strong> {Number(proveedor.descuento).toLocaleString('es-AR')}%
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {proveedor.observaciones && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Observaciones
                    </Typography>
                    <Typography variant="body1">
                      {proveedor.observaciones}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* Pestañas para contactos y materiales */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Contactos" />
          <Tab label="Materiales" />
        </Tabs>
      </Paper>

      {/* Panel de Contactos */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Contactos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleAddContacto}
          >
            Agregar Contacto
          </Button>
        </Box>
        
        {contactos.length === 0 ? (
          <Alert severity="info">
            Este proveedor no tiene contactos registrados.
          </Alert>
        ) : (
          <List>
            {contactos.map((contacto) => (
              <Paper key={contacto.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{contacto.nombre}</Typography>
                        {contacto.esPrincipal && (
                          <Chip 
                            label="Principal" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {contacto.cargo && (
                          <Typography variant="body2" component="div">
                            {contacto.cargo}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 2 } }}>
                          {contacto.telefono && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">{contacto.telefono}</Typography>
                            </Box>
                          )}
                          {contacto.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">{contacto.email}</Typography>
                            </Box>
                          )}
                        </Box>
                        {contacto.observaciones && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {contacto.observaciones}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditContacto(contacto)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteContactoConfirm(contacto)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Panel de Materiales */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InventoryIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Materiales Asociados
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/proveedores/${id}/materiales`)}
          >
            Ver todos los materiales
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Esta funcionalidad estará disponible próximamente.
        </Alert>
      </TabPanel>

      {/* Diálogo de confirmación para eliminar proveedor */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este proveedor?
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

      {/* Diálogo para crear/editar contacto */}
      <Dialog 
        open={contactoFormOpen} 
        onClose={() => setContactoFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <ContactoForm 
          contacto={currentContacto} 
          proveedorId={parseInt(id)}
          onClose={() => setContactoFormOpen(false)} 
          onSave={handleSaveContacto} 
        />
      </Dialog>

      {/* Diálogo de confirmación para eliminar contacto */}
      <Dialog
        open={deleteContactoDialogOpen}
        onClose={() => setDeleteContactoDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este contacto?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteContactoDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteContacto} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProveedorDetallePage;