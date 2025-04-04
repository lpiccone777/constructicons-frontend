import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardActions,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  Add, 
  FileUpload, 
  Delete, 
  Edit, 
  Description, 
  Download, 
  Photo, 
  PhotoCamera, 
  Link as LinkIcon,
  Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../services/api';

// URL base para llamadas directas
const API_URL = 'http://localhost:3000';

// Estilos para el input de archivo oculto
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Lista de tipos de documento permitidos
const tiposDocumento = [
  { value: 'plano', label: 'Plano' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'presupuesto', label: 'Presupuesto' },
  { value: 'factura', label: 'Factura' },
  { value: 'nota', label: 'Nota' },
  { value: 'foto', label: 'Fotografía' },
  { value: 'informe', label: 'Informe' },
  { value: 'otro', label: 'Otro' }
];

// Componente principal DocumentosTab
const DocumentosTab = ({ proyectoId }) => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDocumentoId, setSelectedDocumentoId] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file', 'camera', 'url'
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    proyectoId: proyectoId,
    nombre: '',
    descripcion: '',
    tipo: 'plano',
    urlArchivo: '',
    archivo: null
  });

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    tipo: '',
    archivo: ''
  });

  // Cargar documentos del proyecto
  useEffect(() => {
    fetchDocumentos();
  }, [proyectoId]);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const response = await api.documentos.getDocumentos({ proyectoId });
      setDocumentos(response);
      setError(null);
    } catch (err) {
      console.error('Error al cargar documentos:', err);
      setError('No se pudieron cargar los documentos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando se corrige el campo
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño del archivo (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          archivo: 'El archivo excede el tamaño máximo permitido (10MB)'
        }));
        return;
      }

      // Validar tipo de archivo permitido
      const allowedTypes = [
        'application/pdf', 
        'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'application/rtf', 'application/zip',
        'application/x-dxf', 'application/x-dwg', 'image/vnd.dwg', 'image/x-dwg'
      ];

      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          archivo: 'Tipo de archivo no permitido'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        archivo: file,
        nombre: prev.nombre || file.name.split('.')[0] // Sugerir nombre basado en archivo si está vacío
      }));

      setFormErrors(prev => ({
        ...prev,
        archivo: ''
      }));
    }
  };

  // Simular la toma de foto (en un entorno real usaría la API de la cámara)
  const handleCameraCapture = () => {
    // En una implementación real, esto utilizaría la API MediaDevices.getUserMedia()
    // Por ahora simplemente simulamos que se tomó una foto
    alert("En un entorno de producción, aquí se abriría la cámara para tomar una foto");
    
    // Simular una foto tomada (en la práctica real, esto sería un Blob de la cámara)
    const mockImageFile = new File(["mock image content"], "foto_capturada.jpg", { type: "image/jpeg" });
    
    setFormData(prev => ({
      ...prev,
      archivo: mockImageFile,
      nombre: prev.nombre || 'Foto capturada'
    }));
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
      isValid = false;
    }

    if (!formData.tipo) {
      errors.tipo = 'El tipo de documento es obligatorio';
      isValid = false;
    }

    // Validar que haya un archivo o una URL dependiendo del método seleccionado
    if (uploadMethod === 'file' || uploadMethod === 'camera') {
      if (!formData.archivo) {
        errors.archivo = 'Debe seleccionar un archivo';
        isValid = false;
      }
    } else if (uploadMethod === 'url') {
      if (!formData.urlArchivo) {
        errors.urlArchivo = 'La URL es obligatoria';
        isValid = false;
      } else if (!formData.urlArchivo.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/)) {
        errors.urlArchivo = 'Ingrese una URL válida';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Abrir diálogo para nuevo documento
  const handleOpenDialog = () => {
    setFormData({
      proyectoId: proyectoId,
      nombre: '',
      descripcion: '',
      tipo: 'plano',
      urlArchivo: '',
      archivo: null
    });
    setFormErrors({
      nombre: '',
      tipo: '',
      archivo: '',
      urlArchivo: ''
    });
    setUploadMethod('file');
    setOpenDialog(true);
  };

  // Función para simular progreso de carga
  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    return () => clearInterval(interval);
  };

  // Guardar documento
  const handleSaveDocumento = async () => {
    if (!validateForm()) return;

    try {
      let response;
      
      if (uploadMethod === 'url') {
        // Crear documento con URL
        response = await api.documentos.createDocumento({
          proyectoId: Number(proyectoId),
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipo: formData.tipo,
          urlArchivo: formData.urlArchivo
        });
      } else {
        // Subir archivo (file o camera)
        const formDataToSend = new FormData();
        formDataToSend.append('archivo', formData.archivo);
        formDataToSend.append('proyectoId', proyectoId);
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('descripcion', formData.descripcion);
        formDataToSend.append('tipo', formData.tipo);
        
        // Simular progreso de carga
        const stopProgress = simulateProgress();
        
        response = await api.documentos.uploadDocumento(formDataToSend);
        stopProgress();
        setIsUploading(false);
      }

      // Asegurarnos de que tiene fecha de carga para documentos recién creados
      if (!response.fechaCarga) {
        response.fechaCarga = new Date().toISOString();
      }
      
      // Actualizar lista de documentos
      setDocumentos(prev => [...prev, response]);
      setOpenDialog(false);
      
      // Reiniciar formulario
      setFormData({
        proyectoId: proyectoId,
        nombre: '',
        descripcion: '',
        tipo: 'plano',
        urlArchivo: '',
        archivo: null
      });
      
    } catch (err) {
      console.error('Error al guardar documento:', err);
      setIsUploading(false);
      setError('No se pudo guardar el documento. Por favor, intente nuevamente.');
    }
  };

  // Abrir confirmación para eliminar
  const handleDeleteConfirm = (id) => {
    setSelectedDocumentoId(id);
    setConfirmDeleteOpen(true);
  };

  // Eliminar documento
  const handleDeleteDocumento = async () => {
    try {
      await api.documentos.deleteDocumento(selectedDocumentoId);
      
      // Actualizar lista de documentos
      setDocumentos(prev => prev.filter(doc => doc.id !== selectedDocumentoId));
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      setError('No se pudo eliminar el documento. Por favor, intente nuevamente.');
    }
  };

  // Descargar o abrir documento
  const handleDownloadDocumento = async (id, nombre, abrir = false) => {
    try {
      const response = await api.documentos.downloadDocumento(id);
      
      // Crear blob desde la respuesta
      const blob = response.data;
      
      // Intentar obtener nombre de archivo y tipo MIME de los headers de respuesta
      let filename = nombre || `documento_${id}`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      if (abrir) {
        // Abrir en nueva pestaña
        window.open(url, '_blank');
      } else {
        // Crear elemento <a> para descargar
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      // Programar limpieza del objeto URL (después de que se use)
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 3000);
    } catch (err) {
      console.error('Error al descargar documento:', err);
      setError('No se pudo descargar el documento. Por favor, intente nuevamente.');
    }
  };

  // Filtrar documentos por tipo
  const filteredDocumentos = tipoFiltro 
    ? documentos.filter(doc => doc.tipo === tipoFiltro) 
    : documentos;

  return (
    <Box>
      {/* Cabecera y controles */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Filtrar por tipo</InputLabel>
            <Select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              label="Filtrar por tipo"
            >
              <MenuItem value="">Todos</MenuItem>
              {tiposDocumento.map(tipo => (
                <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Nuevo Documento
        </Button>
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Cargando */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista de documentos */}
      {!loading && filteredDocumentos.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No hay documentos {tipoFiltro && `de tipo ${tipoFiltro}`} para este proyecto.
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredDocumentos.map(documento => (
          <Grid item xs={12} sm={6} md={4} key={documento.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" noWrap>
                    {documento.nombre}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={tiposDocumento.find(t => t.value === documento.tipo)?.label || documento.tipo} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }} noWrap>
                  {documento.descripcion || 'Sin descripción'}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {documento.urlArchivo ? (
                    <LinkIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  ) : (
                    <Description fontSize="small" color="action" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {documento.fechaCarga ? new Date(documento.fechaCarga).toLocaleDateString() : 'Recién creado'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Download />}
                  onClick={() => handleDownloadDocumento(documento.id, documento.nombre)}
                >
                  Descargar
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    // Usar la misma función de descarga pero con visualización directa
                    handleDownloadDocumento(documento.id, documento.nombre, true);
                  }}
                >
                  Abrir
                </Button>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDeleteConfirm(documento.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para crear documento */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Nuevo Documento
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Método de carga:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
                    startIcon={<FileUpload />}
                    onClick={() => setUploadMethod('file')}
                  >
                    Subir archivo
                  </Button>
                  <Button 
                    variant={uploadMethod === 'camera' ? 'contained' : 'outlined'}
                    startIcon={<PhotoCamera />}
                    onClick={() => setUploadMethod('camera')}
                  >
                    Tomar foto
                  </Button>
                  <Button 
                    variant={uploadMethod === 'url' ? 'contained' : 'outlined'}
                    startIcon={<LinkIcon />}
                    onClick={() => setUploadMethod('url')}
                  >
                    Agregar URL
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre del documento"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                required
                error={!!formErrors.nombre}
                helperText={formErrors.nombre}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!formErrors.tipo}>
                <InputLabel>Tipo de documento</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo de documento"
                >
                  {tiposDocumento.map(tipo => (
                    <MenuItem key={tipo.value} value={tipo.value}>{tipo.label}</MenuItem>
                  ))}
                </Select>
                {formErrors.tipo && <FormHelperText>{formErrors.tipo}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            {/* Campos según el método de carga */}
            {uploadMethod === 'file' && (
              <Grid item xs={12}>
                <Box sx={{ mt: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<FileUpload />}
                    sx={{ mb: 1 }}
                  >
                    Seleccionar archivo
                    <VisuallyHiddenInput 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.svg,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.zip,.dxf,.dwg"
                    />
                  </Button>
                  {formData.archivo && (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Archivo seleccionado: {formData.archivo.name} ({(formData.archivo.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  )}
                  {formErrors.archivo && (
                    <FormHelperText error>{formErrors.archivo}</FormHelperText>
                  )}
                  <FormHelperText>
                    Formatos permitidos: PDF, imágenes (JPG, PNG, GIF, SVG), documentos Office, TXT, RTF, ZIP, AutoCAD. Tamaño máximo: 10MB
                  </FormHelperText>
                </Box>
              </Grid>
            )}

            {uploadMethod === 'camera' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={handleCameraCapture}
                    sx={{ mb: 2 }}
                  >
                    Tomar foto
                  </Button>
                  {formData.archivo && (
                    <Typography variant="body2">
                      Foto capturada: {formData.archivo.name}
                    </Typography>
                  )}
                  {!formData.archivo && (
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 150, 
                        backgroundColor: '#f5f5f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px dashed #bdbdbd',
                        borderRadius: 1
                      }}
                    >
                      <Photo sx={{ fontSize: 40, color: '#bdbdbd' }} />
                    </Box>
                  )}
                  {formErrors.archivo && (
                    <FormHelperText error>{formErrors.archivo}</FormHelperText>
                  )}
                </Box>
              </Grid>
            )}

            {uploadMethod === 'url' && (
              <Grid item xs={12}>
                <TextField
                  label="URL del documento"
                  name="urlArchivo"
                  value={formData.urlArchivo}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!formErrors.urlArchivo}
                  helperText={formErrors.urlArchivo || "Ingrese la URL completa del documento (ej: https://ejemplo.com/documento.pdf)"}
                  placeholder="https://"
                />
              </Grid>
            )}

            {isUploading && (
              <Grid item xs={12}>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    Subiendo documento... {uploadProgress}%
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveDocumento}
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleDeleteDocumento} 
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

export default DocumentosTab;