import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
  Tab,
  Tabs,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GraficosReportes from "../../components/Reportes/GraficosReportes";
import TablaReportes from "../../components/Reportes/TablaReportes";
import KPICard from "../../components/Reportes/KPICard";
import ExportarPDFButton from "../../components/Reportes/ExportarPDFButton";
import api from "../../services/api";

// Panel de contenido para las pestañas
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rrhh-tabpanel-${index}`}
      aria-labelledby={`rrhh-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const RecursosHumanosPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recursosData, setRecursosData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filtroEmpleado, setFiltroEmpleado] = useState("");

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.reportes.getRecursosHumanos();
        setRecursosData(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos de recursos humanos:", err);
        setError(
          "No se pudieron cargar los datos de recursos humanos. Por favor, intente nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Preparar datos para gráfico de especialidades demandadas
  const prepareEspecialidadesData = () => {
    if (!recursosData) return [];

    return recursosData.especialidadesDemandadas.map((esp) => ({
      especialidad: esp.nombre,
      cantidadEmpleados: esp.cantidadEmpleados,
      proyectosAsignados: esp.proyectosAsignados,
      horasAsignadas: esp.horasAsignadas,
      costoEstimado: esp.costoEstimado,
    }));
  };

  // Preparar datos para el gráfico de carga de trabajo por especialidad
  const prepareCargaTrabajoData = () => {
    if (!recursosData) return [];

    return recursosData.especialidadesDemandadas.map((esp) => ({
      name: esp.nombre,
      // Si el backend no proporciona horasDisponibles, calculamos un valor ficticio
      // basado en cantidadEmpleados (8 horas por empleado)
      horasDisponibles: esp.horasDisponibles || esp.cantidadEmpleados * 8 || 8,
      horasAsignadas: esp.horasAsignadas || 0,
      // Si porcentajeAsignacion no existe, calculamos uno
      porcentajeAsignacion:
        esp.porcentajeAsignacion ||
        Math.round(
          ((esp.horasAsignadas || 0) /
            (esp.horasDisponibles || esp.cantidadEmpleados * 8 || 8)) *
            100
        ),
    }));
  };

  // Preparar datos para el gráfico radar de habilidades
  const prepareHabilidadesData = () => {
    if (!recursosData || !recursosData.distribucionHabilidades) return [];

    return Object.entries(recursosData.distribucionHabilidades).map(
      ([habilidad, valor]) => ({
        habilidad,
        valor,
      })
    );
  };

  // Preparar series para el gráfico de carga de trabajo
  const prepareCargaTrabajoSeries = () => {
    return [
      {
        dataKey: "horasAsignadas",
        nombre: "Horas Asignadas",
        color: theme.palette.primary.main,
        // No usar yAxisId o asignarle "left"
      },
      {
        dataKey: "horasDisponibles",
        nombre: "Horas Disponibles",
        color: theme.palette.secondary.main,
        // No usar yAxisId o asignarle "left"
      },
    ];
  };

  // Filtrar empleados por nombre
  const getEmpleadosFiltrados = () => {
    if (!recursosData) return [];

    return recursosData.asignacionEmpleados
      .filter((empleado) =>
        filtroEmpleado
          ? empleado.nombre
              .toLowerCase()
              .includes(filtroEmpleado.toLowerCase()) ||
            (empleado.especialidad &&
              empleado.especialidad
                .toLowerCase()
                .includes(filtroEmpleado.toLowerCase()))
          : true
      )
      .map((empleado) => ({
        ...empleado,
        // Añadir campos que podrían faltar en la respuesta del backend
        proyecto:
          empleado.proyectosAsignados && empleado.proyectosAsignados.length > 0
            ? empleado.proyectosAsignados[0].nombre
            : "Sin asignar",
        horasAsignadas: empleado.proyectosAsignados
          ? empleado.proyectosAsignados.reduce(
              (sum, p) => sum + (p.horasAsignadas || 0),
              0
            )
          : 0,
        horasDisponibles: 40, // Por defecto 40 horas semanales
        porcentajeOcupacion: empleado.cargaActual
          ? empleado.cargaActual * 20
          : 0, // Convertir cargaActual a porcentaje
        estado:
          empleado.cargaActual >= 4
            ? "No disponible"
            : empleado.cargaActual >= 2
            ? "Parcial"
            : "Disponible",
      }));
  };

  // Configurar columnas para la tabla de disponibilidad
  const columnasDisponibilidad = [
    { id: "nombre", etiqueta: "Nombre", tipo: "texto" },
    {
      id: "especialidad",
      etiqueta: "Especialidad",
      tipo: "estado",
      colores: {
        Albañilería: "primary",
        Electricidad: "secondary",
        Plomería: "info",
        Carpintería: "warning",
        Pintura: "success",
      },
      variante: "outlined",
    },
    { id: "proyecto", etiqueta: "Proyecto Actual", tipo: "texto" },
    { id: "horasAsignadas", etiqueta: "Horas Asignadas", tipo: "numero" },
    { id: "horasDisponibles", etiqueta: "Horas Disponibles", tipo: "numero" },
    {
      id: "porcentajeOcupacion",
      etiqueta: "Ocupación",
      tipo: "indicador",
      umbrales: { critico: 90, advertencia: 75, normal: 0 },
      renderCell: (value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={value}
            color={value > 90 ? "error" : value > 75 ? "warning" : "success"}
            sx={{ height: 8, borderRadius: 5, flexGrow: 1, mr: 1 }}
          />
          <Typography variant="body2">{`${value}%`}</Typography>
        </Box>
      ),
    },
    {
      id: "estado",
      etiqueta: "Estado",
      tipo: "estado",
      colores: {
        Disponible: "success",
        Parcial: "warning",
        "No disponible": "error",
      },
    },
  ];

  // Configurar columnas para la tabla de proyección
  const columnasProyeccion = [
    {
      id: "especialidad",
      etiqueta: "Especialidad",
      tipo: "estado",
      colores: {
        Albañilería: "primary",
        Electricidad: "secondary",
        Plomería: "info",
        Carpintería: "warning",
        Pintura: "success",
      },
      variante: "outlined",
    },
    { id: "actualEmpleados", etiqueta: "Empleados Actuales", tipo: "numero" },
    {
      id: "proyeccionNecesidad",
      etiqueta: "Necesidad Proyectada",
      tipo: "numero",
    },
    {
      id: "diferencia",
      etiqueta: "Diferencia",
      tipo: "indicador",
      umbrales: { critico: -3, advertencia: -1, normal: 0 },
      renderCell: (value, row) => (
        <Typography
          variant="body2"
          color={value < 0 ? "error.main" : "success.main"}
          fontWeight="bold"
        >
          {value > 0 ? `+${value}` : value}
        </Typography>
      ),
    },
  ];

  // Manejar cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cambio de filtro
  const handleFiltroEmpleadoChange = (event) => {
    setFiltroEmpleado(event.target.value);
  };

  // Función para obtener iniciales del nombre
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!recursosData) {
    return (
      <Alert severity="warning">No hay datos disponibles para mostrar.</Alert>
    );
  }

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
          Recursos Humanos
        </Typography>
        <ExportarPDFButton titulo="Reporte de Recursos Humanos" />
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Especialidades"
            value={recursosData.especialidadesDemandadas.length}
            icon={<BusinessCenterIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Empleados"
            value={recursosData.asignacionEmpleados.length}
            icon={<PeopleAltIcon fontSize="large" />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Horas Asignadas Total"
            value={recursosData.especialidadesDemandadas.reduce(
              (acc, curr) => acc + curr.horasAsignadas,
              0
            )}
            icon={<AccessTimeIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Costo Estimado Total"
            value={`$${recursosData.especialidadesDemandadas
              .reduce((acc, curr) => acc + curr.costoEstimado, 0)
              .toLocaleString("es-AR")}`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      {/* Pestañas */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Especialidades" />
          <Tab label="Empleados" />
          <Tab label="Proyección" />
        </Tabs>
      </Paper>

      {/* Contenido de las pestañas */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Gráfico de Especialidades Demandadas */}
          <Grid item xs={12} lg={6}>
            <GraficosReportes
              tipo="barras"
              datos={prepareEspecialidadesData()}
              series={[
                {
                  dataKey: "cantidadEmpleados",
                  nombre: "Empleados",
                  color: theme.palette.primary.main,
                },
                {
                  dataKey: "proyectosAsignados",
                  nombre: "Proyectos",
                  color: theme.palette.secondary.main,
                },
              ]}
              config={{
                titulo: "Especialidades más Demandadas",
                subtitulo:
                  "Distribución de empleados y proyectos por especialidad",
                ejeXKey: "especialidad",
                nombreEjeY: "Cantidad",
                margen: { top: 20, right: 30, left: 20, bottom: 30 },
              }}
            />
          </Grid>

          {/* Gráfico de Carga de Trabajo por Especialidad */}
          <Grid item xs={12} lg={6}>
            <GraficosReportes
              tipo="barras"
              datos={prepareCargaTrabajoData()}
              series={prepareCargaTrabajoSeries()}
              config={{
                titulo: "Carga de Trabajo por Especialidad",
                subtitulo:
                  "Horas asignadas vs horas disponibles por especialidad",
                ejeXKey: "name",
                nombreEjeY: "Horas",
                margen: { top: 20, right: 30, left: 20, bottom: 30 },
              }}
            />
          </Grid>

          {/* Gráfico de Distribución de Habilidades */}
          <Grid item xs={12} lg={6}>
            <GraficosReportes
              tipo="radar"
              datos={prepareHabilidadesData()}
              series={[
                {
                  dataKey: "valor",
                  nombre: "Nivel de Habilidad",
                  color: theme.palette.primary.main,
                },
              ]}
              config={{
                titulo: "Distribución de Habilidades",
                subtitulo: "Nivel de competencia por habilidad en la empresa",
                categoryKey: "habilidad",
                domain: [0, 10],
                radiusAxisAngle: 30,
              }}
            />
          </Grid>

          {/* Gráfico de Costos por Especialidad */}
          <Grid item xs={12} lg={6}>
            <GraficosReportes
              tipo="barras"
              datos={prepareEspecialidadesData()}
              series={[
                {
                  dataKey: "costoEstimado",
                  nombre: "Costo Estimado",
                  color: theme.palette.secondary.main,
                },
              ]}
              config={{
                titulo: "Costos por Especialidad",
                subtitulo: "Estimación de costos totales por especialidad",
                ejeXKey: "especialidad",
                nombreEjeY: "Costo ($)",
                margen: { top: 20, right: 30, left: 20, bottom: 30 },
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Filtro para búsqueda de empleados */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="filtro-empleado-label">
                Buscar Empleado
              </InputLabel>
              <Select
                labelId="filtro-empleado-label"
                id="filtro-empleado"
                value={filtroEmpleado}
                onChange={handleFiltroEmpleadoChange}
                label="Buscar Empleado"
              >
                <MenuItem value="">Todos</MenuItem>
                {recursosData.asignacionEmpleados.map((emp) => (
                  <MenuItem key={emp.id} value={emp.nombre}>
                    {emp.nombre} - {emp.especialidad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Box>

        {/* Tabla de Disponibilidad de Recursos */}
        <TablaReportes
          datos={getEmpleadosFiltrados()}
          columnas={columnasDisponibilidad}
          config={{
            titulo: "Disponibilidad de Recursos",
            subtitulo:
              "Estado actual de asignación y disponibilidad de empleados",
            filasPorPagina: 10,
            ordenInicial: { campo: "porcentajeOcupacion", tipo: "desc" },
          }}
        />

        {/* Listado de empleados */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Detalles de Empleados
        </Typography>
        <Grid container spacing={2}>
          {getEmpleadosFiltrados().map((empleado) => (
            <Grid item xs={12} sm={6} md={4} key={empleado.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          empleado.porcentajeOcupacion > 90
                            ? theme.palette.error.main
                            : empleado.porcentajeOcupacion > 75
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                        mr: 2,
                      }}
                    >
                      {getInitials(empleado.nombre)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {empleado.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {empleado.especialidad}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Proyecto actual: {empleado.proyecto || "Sin asignar"}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Ocupación: {empleado.porcentajeOcupacion}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={empleado.porcentajeOcupacion}
                      color={
                        empleado.porcentajeOcupacion > 90
                          ? "error"
                          : empleado.porcentajeOcupacion > 75
                          ? "warning"
                          : "success"
                      }
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2">
                      Horas asignadas: {empleado.horasAsignadas}
                    </Typography>
                    <Typography variant="body2">
                      Disponibles: {empleado.horasDisponibles}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Proyección de necesidades futuras de personal */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <TablaReportes
              datos={recursosData.proyeccionNecesidades || []}
              columnas={columnasProyeccion}
              config={{
                titulo: "Proyección de Necesidades Futuras",
                subtitulo:
                  "Estimación de necesidades de recursos basado en proyectos planificados",
                filasPorPagina: 10,
                ordenInicial: { campo: "diferencia", tipo: "asc" },
              }}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <GraficosReportes
              tipo="barras"
              datos={recursosData.proyeccionNecesidades || []}
              series={[
                {
                  dataKey: "actualEmpleados",
                  nombre: "Empleados Actuales",
                  color: theme.palette.primary.main,
                },
                {
                  dataKey: "proyeccionNecesidad",
                  nombre: "Necesidad Proyectada",
                  color: theme.palette.secondary.main,
                },
              ]}
              config={{
                titulo: "Proyección de Personal",
                subtitulo:
                  "Comparativa entre personal actual y necesidades futuras",
                ejeXKey: "especialidad",
                nombreEjeY: "Cantidad",
                margen: { top: 20, right: 30, left: 20, bottom: 30 },
              }}
            />
          </Grid>

          {/* Gráfico de Capacidad Futura */}
          <Grid item xs={12}>
            <GraficosReportes
              tipo="lineas"
              datos={recursosData.proyeccionCapacidad || []}
              series={[
                {
                  dataKey: "capacidadActual",
                  nombre: "Capacidad Actual",
                  color: theme.palette.primary.main,
                },
                {
                  dataKey: "demandaProyectada",
                  nombre: "Demanda Proyectada",
                  color: theme.palette.secondary.main,
                },
              ]}
              config={{
                titulo: "Proyección de Capacidad vs Demanda",
                subtitulo:
                  "Evolución mensual de capacidad y demanda de recursos",
                ejeXKey: "mes",
                nombreEjeY: "Horas",
                margen: { top: 20, right: 30, left: 20, bottom: 30 },
              }}
            />
          </Grid>

          {/* Indicadores de sobreasignación */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Indicadores de Sobreasignación
              </Typography>

              <Box sx={{ mt: 2 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Empleado</TableCell>
                        <TableCell>Especialidad</TableCell>
                        <TableCell>Proyectos Asignados</TableCell>
                        <TableCell>Porcentaje Ocupación</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recursosData.sobreasignaciones &&
                        recursosData.sobreasignaciones.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.empleado}</TableCell>
                            <TableCell>{item.especialidad}</TableCell>
                            <TableCell>{item.proyectosAsignados}</TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <LinearProgress
                                  variant="determinate"
                                  value={
                                    item.porcentajeOcupacion > 100
                                      ? 100
                                      : item.porcentajeOcupacion
                                  }
                                  color="error"
                                  sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    width: 100,
                                    mr: 1,
                                  }}
                                />
                                <Typography variant="body2">
                                  {item.porcentajeOcupacion}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="Sobreasignado"
                                size="small"
                                color="error"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default RecursosHumanosPage;
