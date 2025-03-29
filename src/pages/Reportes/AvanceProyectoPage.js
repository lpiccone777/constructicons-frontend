import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import KPICard from '../../components/Reportes/KPICard';
import ExportarPDFButton from '../../components/Reportes/ExportarPDFButton';
import api from '../../services/api';

const AvanceProyectoPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proyectoData, setProyectoData] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [selectedProyectoId, setSelectedProyectoId] = useState("");

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await api.proyectos.getProyectos();
        setProyectos(data);
        // Seleccionar el primer proyecto por defecto
        if (data.length > 0 && !selectedProyectoId) {
          setSelectedProyectoId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        setError('No se pudieron cargar los proyectos.');
      }
    };

    fetchProyectos();
  }, []);

  useEffect(() => {
    const fetchProyectoData = async () => {
      if (!selectedProyectoId) return;
      
      try {
        setLoading(true);
        const data = await api.reportes.getAvanceProyecto(selectedProyectoId);
        setProyectoData(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del proyecto:', err);
        setError('No se pudieron cargar los datos del proyecto. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedProyectoId) {
      fetchProyectoData();
    }
  }, [selectedProyectoId]);

  const handleProyectoChange = (event) => {
    setSelectedProyectoId(event.target.value);
  };

  // Preparar datos para el gráfico de avance de etapas
  const prepareEtapasData = () => {
    if (!proyectoData) return [];
    
    return proyectoData.etapas.map(etapa => ({
      nombre: etapa.nombre,
      avance: etapa.avance,
      presupuesto: etapa.presupuesto,
      presupuestoConsumido: etapa.presupuestoConsumido
    }));
  };

  // Formateador de fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
  };

  // Obtener color de riesgo
  const getRiskColor = (impacto) => {
    switch (impacto.toLowerCase()) {
      case 'alto':
        return theme.palette.error.main;
      case 'medio':
        return theme.palette.warning.main;
      case 'bajo':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Obtener color para estado de tarea
  const getTaskStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'completada':
        return theme.palette.success.main;
      case 'en_progreso':
        return theme.palette.primary.main;
      case 'pendiente':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !proyectoData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Informe de Avance de Proyecto
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 250 }} size="small">
            <InputLabel id="proyecto-select-label">Seleccionar Proyecto</InputLabel>
            <Select
              labelId="proyecto-select-label"
              id="proyecto-select"
              value={selectedProyectoId}
              label="Seleccionar Proyecto"
              onChange={handleProyectoChange}
            >
              {proyectos.map((proyecto) => (
                <MenuItem key={proyecto.id} value={proyecto.id.toString()}>
                  {proyecto.codigo} - {proyecto.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {proyectoData && <ExportarPDFButton titulo={`Avance del Proyecto ${proyectoData.proyecto.nombre}`} />}
        </Box>
      </Box>

      {!proyectoData ? (
        <Alert severity="info">
          Seleccione un proyecto para visualizar su informe de avance.
        </Alert>
      ) : (
        <>
          {/* Información general del proyecto */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {proyectoData.proyecto.nombre}
              <Chip 
                label={`Código: ${proyectoData.proyecto.codigo}`} 
                size="small" 
                variant="outlined" 
                sx={{ ml: 2 }} 
              />
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {proyectoData.proyecto.descripcion}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* KPIs */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <KPICard
                  title="Avance General"
                  value={`${proyectoData.proyecto.avanceGeneral}%`}
                  icon={<EngineeringIcon fontSize="large" />}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPICard
                  title="Presupuesto Total"
                  value={`$${proyectoData.proyecto.presupuestoTotal.toLocaleString('es-AR')}`}
                  icon={<AttachMoneyIcon fontSize="large" />}
                  color={theme.palette.secondary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KPICard
                  title="Presupuesto Ejecutado"
                  value={`$${proyectoData.proyecto.presupuestoEjecutado.toLocaleString('es-AR')}`}
                  subtitle={`${Math.round((proyectoData.proyecto.presupuestoEjecutado / proyectoData.proyecto.presupuestoTotal) * 100)}% del total`}
                  icon={<AttachMoneyIcon fontSize="large" />}
                  color={theme.palette.warning.main}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Fechas del Proyecto
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Inicio
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(proyectoData.proyecto.fechaInicio)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fin Estimado
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(proyectoData.proyecto.fechaFinEstimada)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fin Proyectado
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(proyectoData.proyecto.fechaFinProyectada)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Variaciones del Proyecto
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Variación de Tiempo
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color={proyectoData.proyecto.diasAdelanto < 0 ? 'error.main' : 'success.main'}
                      >
                        {proyectoData.proyecto.diasAdelanto < 0 
                          ? `${Math.abs(proyectoData.proyecto.diasAdelanto)} días de retraso` 
                          : proyectoData.proyecto.diasAdelanto > 0 
                            ? `${proyectoData.proyecto.diasAdelanto} días de adelanto`
                            : 'En tiempo'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Variación de Presupuesto
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color={proyectoData.proyecto.variacionPresupuesto < 0 ? 'error.main' : 'success.main'}
                      >
                        {proyectoData.proyecto.variacionPresupuesto < 0 
                          ? `$${Math.abs(proyectoData.proyecto.variacionPresupuesto).toLocaleString('es-AR')} de sobrecosto` 
                          : proyectoData.proyecto.variacionPresupuesto > 0 
                            ? `$${proyectoData.proyecto.variacionPresupuesto.toLocaleString('es-AR')} de ahorro`
                            : 'En presupuesto'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Gráfico de avance de etapas */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Avance de Etapas
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareEtapasData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                  <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avance" name="Avance (%)" fill={theme.palette.primary.main} />
                  <Bar yAxisId="right" dataKey="presupuestoConsumido" name="Presupuesto Consumido ($)" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Etapas y tareas */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalle de Etapas y Tareas
            </Typography>
            
            {proyectoData.etapas.map((etapa) => (
              <Accordion key={etapa.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {etapa.orden}. {etapa.nombre}
                      </Typography>
                      <Chip 
                        label={etapa.estado.charAt(0).toUpperCase() + etapa.estado.slice(1)} 
                        color={
                          etapa.estado === 'completada' ? 'success' : 
                          etapa.estado === 'en_progreso' ? 'primary' : 'default'
                        } 
                        size="small" 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={etapa.avance} 
                          color={
                            etapa.avance === 100 ? 'success' : 
                            etapa.avance > 50 ? 'primary' : 'warning'
                          }
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${etapa.avance}%`}</Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(etapa.fechaInicio)} - {formatDate(etapa.fechaFinEstimada)}
                        {etapa.fechaFinReal && ` (Finalizada: ${formatDate(etapa.fechaFinReal)})`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Presupuesto: ${etapa.presupuesto.toLocaleString('es-AR')} | 
                        Consumido: ${etapa.presupuestoConsumido.toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>
                    Tareas ({etapa.tareas ? etapa.tareas.length : 0})
                  </Typography>
                  
                  {etapa.tareas && etapa.tareas.length > 0 ? (
                    <List>
                      {etapa.tareas.map((tarea) => (
                        <ListItem 
                          key={tarea.id}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            py: 1
                          }}
                        >
                          <ListItemIcon>
                            <TaskAltIcon 
                              style={{ 
                                color: getTaskStatusColor(tarea.estado)
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={tarea.nombre}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  Estado: {tarea.estado.charAt(0).toUpperCase() + tarea.estado.slice(1).replace('_', ' ')}
                                </Typography>
                                <br />
                                <Typography variant="body2" component="span">
                                  Responsables: {tarea.responsables.join(', ')}
                                </Typography>
                              </Box>
                            }
                          />
                          {tarea.materialesAsignados && tarea.materialesAsignados.length > 0 && (
                            <Chip 
                              label={`${tarea.materialesAsignados.length} materiales`} 
                              size="small" 
                              color="info" 
                              variant="outlined"
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay tareas en esta etapa
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Riesgos */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Riesgos Identificados
                </Typography>
                
                {proyectoData.riesgosIdentificados && proyectoData.riesgosIdentificados.length > 0 ? (
                  <List>
                    {proyectoData.riesgosIdentificados.map((riesgo, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemIcon>
                          <WarningIcon style={{ color: getRiskColor(riesgo.impacto) }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={riesgo.descripcion}
                          secondary={
                            <Box>
                              <Typography variant="body2" component="span">
                                Impacto: {riesgo.impacto.charAt(0).toUpperCase() + riesgo.impacto.slice(1)}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                Estado: {riesgo.estado.charAt(0).toUpperCase() + riesgo.estado.slice(1)}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                Acción: {riesgo.accionPropuesta}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay riesgos identificados para este proyecto.
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Documentos Clave
                </Typography>
                
                {proyectoData.documentosClaves && proyectoData.documentosClaves.length > 0 ? (
                  <List>
                    {proyectoData.documentosClaves.map((documento) => (
                      <ListItem 
                        key={documento.id}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemIcon>
                          <DescriptionIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={documento.nombre}
                          secondary={
                            <Box>
                              <Typography variant="body2" component="span">
                                Tipo: {documento.tipo.charAt(0).toUpperCase() + documento.tipo.slice(1)}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                Fecha carga: {formatDate(documento.fechaCarga)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay documentos clave registrados para este proyecto.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AvanceProyectoPage;