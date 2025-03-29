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
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import SavingsIcon from '@mui/icons-material/Savings';
import KPICard from '../../components/Reportes/KPICard';
import ExportarPDFButton from '../../components/Reportes/ExportarPDFButton';
import GraficosReportes from '../../components/Reportes/GraficosReportes';
import TablaReportes from '../../components/Reportes/TablaReportes';
import api from '../../services/api';

const AnalisisMaterialesPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialesData, setMaterialesData] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('ahorroPotencial');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.reportes.getAnalisisMateriales();
        setMaterialesData(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos de materiales:', err);
        setError('No se pudieron cargar los datos de materiales. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar y ordenar los datos de materiales
  const getDataFiltrada = () => {
    if (!materialesData) return [];

    let datosFiltrados = [...materialesData.comparativaProveedores];

    // Aplicar filtro por categoría
    if (filtroCategoria) {
      datosFiltrados = datosFiltrados.filter(item => item.material.categoria === filtroCategoria);
    }

    // Aplicar filtro por rango de precio
    if (filtroPrecioMin) {
      const precioMin = parseFloat(filtroPrecioMin);
      datosFiltrados = datosFiltrados.filter(item => item.material.precioReferencia >= precioMin);
    }

    if (filtroPrecioMax) {
      const precioMax = parseFloat(filtroPrecioMax);
      datosFiltrados = datosFiltrados.filter(item => item.material.precioReferencia <= precioMax);
    }

    // Aplicar ordenamiento
    switch (ordenamiento) {
      case 'ahorroPotencial':
        datosFiltrados.sort((a, b) => b.ahorroPotencial - a.ahorroPotencial);
        break;
      case 'precio':
        datosFiltrados.sort((a, b) => b.material.precioReferencia - a.material.precioReferencia);
        break;
      case 'nombre':
        datosFiltrados.sort((a, b) => a.material.nombre.localeCompare(b.material.nombre));
        break;
      case 'categoria':
        datosFiltrados.sort((a, b) => a.material.categoria.localeCompare(b.material.categoria));
        break;
      case 'variacion':
        datosFiltrados.sort((a, b) => a.variacionPorcentaje - b.variacionPorcentaje);
        break;
      default:
        break;
    }

    return datosFiltrados;
  };

  // Preparar datos para la gráfica de comparativa de precios entre proveedores
  const prepararDatosComparativaPrecios = () => {
    if (!materialesData || !materialesData.materialesPorProveedor) return [];

    // Obtener los 5 materiales más costosos para la comparativa
    const materialesCostosos = materialesData.comparativaProveedores
      .sort((a, b) => b.material.precioReferencia - a.material.precioReferencia)
      .slice(0, 5);

    // Preparar datos para gráfico agrupando por material y mostrando precio por proveedor
    const datosGrafico = [];

    materialesCostosos.forEach(material => {
      const datoMaterial = {
        nombre: material.material.nombre,
        precioReferencia: material.material.precioReferencia,
      };

      // Buscar precios de este material en diferentes proveedores
      materialesData.materialesPorProveedor.forEach(proveedor => {
        const precioProveedor = proveedor.materiales.find(m => m.materialId === material.material.id);
        if (precioProveedor) {
          datoMaterial[`${proveedor.nombre}`] = precioProveedor.precio;
        }
      });

      datosGrafico.push(datoMaterial);
    });

    return datosGrafico;
  };

  // Preparar series para el gráfico de comparativa de precios
  const prepararSeriesComparativaPrecios = () => {
    if (!materialesData || !materialesData.materialesPorProveedor) return [];

    const series = [
      {
        dataKey: 'precioReferencia',
        nombre: 'Precio Referencia',
        color: theme.palette.primary.main
      }
    ];

    // Agregar serie para cada proveedor
    materialesData.materialesPorProveedor.forEach((proveedor, index) => {
      series.push({
        dataKey: proveedor.nombre,
        nombre: proveedor.nombre,
        color: theme.palette.secondary.main // Personalizar colores según sea necesario
      });
    });

    return series;
  };

  // Preparar datos para el gráfico de distribución por estado
  const prepararDatosDistribucionEstado = () => {
    if (!materialesData || !materialesData.distribucionPorEstado) return [];

    return Object.entries(materialesData.distribucionPorEstado).map(([estado, cantidad]) => ({
      name: estado.charAt(0).toUpperCase() + estado.slice(1),
      value: cantidad
    }));
  };

  // Configurar columnas para la tabla de ahorro potencial
  const columnasTabla = [
    { id: 'material.codigo', etiqueta: 'Código', tipo: 'texto' },
    { id: 'material.nombre', etiqueta: 'Material', tipo: 'texto' },
    { id: 'material.categoria', etiqueta: 'Categoría', tipo: 'estado', 
      colores: {
        'estructurales': 'primary',
        'acabados': 'secondary',
        'instalaciones': 'info',
        'herramientas': 'warning',
        'seguridad': 'error',
      },
      variante: 'outlined'
    },
    { id: 'material.precioReferencia', etiqueta: 'Precio Ref.', tipo: 'moneda' },
    { id: 'mejorPrecio', etiqueta: 'Mejor Precio', tipo: 'moneda' },
    { id: 'ahorroPotencial', etiqueta: 'Ahorro Potencial', tipo: 'moneda' },
    { 
      id: 'variacionPorcentaje', 
      etiqueta: 'Variación %', 
      tipo: 'indicador',
      umbrales: { critico: 10, advertencia: 5, normal: 0 },
      indicadorInvertido: true,
      renderCell: (value, row) => (
        <Typography 
          variant="body2" 
          color={value < 0 ? 'success.main' : 'error.main'}
          fontWeight="bold"
        >
          {value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`}
        </Typography>
      )
    },
    { id: 'proveedorMejorPrecio', etiqueta: 'Mejor Proveedor', tipo: 'texto' }
  ];

  // Función para manejar el cambio de categoría
  const handleCategoriaChange = (e) => {
    setFiltroCategoria(e.target.value);
  };

  // Función para manejar el cambio de ordenamiento
  const handleOrdenamientoChange = (e) => {
    setOrdenamiento(e.target.value);
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!materialesData) {
    return (
      <Alert severity="warning">
        No hay datos disponibles para mostrar.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Análisis de Materiales
        </Typography>
        <ExportarPDFButton titulo="Análisis de Materiales" />
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Materiales"
            value={materialesData.totalMateriales}
            icon={<InventoryIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Proveedores"
            value={materialesData.totalProveedores}
            icon={<LocalShippingIcon fontSize="large" />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Materiales Críticos"
            value={materialesData.materialesCriticos.length}
            icon={<WarningIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Ahorro Potencial"
            value={`$${materialesData.ahorroPotencialTotal.toLocaleString('es-AR')}`}
            icon={<SavingsIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros y Ordenamiento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="categoria-filter-label">Categoría</InputLabel>
              <Select
                labelId="categoria-filter-label"
                value={filtroCategoria}
                label="Categoría"
                onChange={handleCategoriaChange}
              >
                <MenuItem value="">Todas</MenuItem>
                {materialesData.categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Precio Mínimo"
              type="number"
              size="small"
              fullWidth
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Precio Máximo"
              type="number"
              size="small"
              fullWidth
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="ordenamiento-label">Ordenar por</InputLabel>
              <Select
                labelId="ordenamiento-label"
                value={ordenamiento}
                label="Ordenar por"
                onChange={handleOrdenamientoChange}
              >
                <MenuItem value="ahorroPotencial">Ahorro Potencial</MenuItem>
                <MenuItem value="precio">Precio</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="categoria">Categoría</MenuItem>
                <MenuItem value="variacion">Variación</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráficos y Tablas */}
      <Grid container spacing={3}>
        {/* Gráfico de Comparativa de Precios entre Proveedores */}
        <Grid item xs={12} lg={6}>
          <GraficosReportes
            tipo="barras"
            datos={prepararDatosComparativaPrecios()}
            series={prepararSeriesComparativaPrecios()}
            config={{
              titulo: 'Comparativa de Precios entre Proveedores',
              subtitulo: 'Top 5 materiales más costosos',
              ejeXKey: 'nombre',
              ejeXAngulo: -45,
              nombreEjeX: 'Material',
              nombreEjeY: 'Precio ($)',
              margen: { top: 20, right: 30, left: 20, bottom: 80 }
            }}
          />
        </Grid>

        {/* Distribución de Estado de Compra de Materiales */}
        <Grid item xs={12} md={6} lg={6}>
          <GraficosReportes
            tipo="circular"
            datos={prepararDatosDistribucionEstado()}
            config={{
              titulo: 'Distribución de Estado de Compra',
              subtitulo: 'Porcentaje de materiales en cada estado',
              dataKey: 'value',
              nameKey: 'name',
              mostrarEtiquetas: true,
              mostrarLeyenda: true,
              radioExterno: 150,
              radioInterno: 60
            }}
          />
        </Grid>

        {/* Tabla de Ahorro Potencial */}
        <Grid item xs={12}>
          <TablaReportes
            datos={getDataFiltrada()}
            columnas={columnasTabla}
            config={{
              titulo: 'Análisis de Ahorro Potencial por Material',
              subtitulo: 'Comparativa de precios y proveedores recomendados',
              filasPorPagina: 10,
              ordenInicial: { campo: 'ahorroPotencial', tipo: 'desc' },
              mostrarBuscador: true
            }}
          />
        </Grid>

        {/* Ranking de Proveedores */}
        <Grid item xs={12}>
          <GraficosReportes
            tipo="barras"
            datos={materialesData.rankingProveedores || []}
            series={[
              {
                dataKey: 'materialesOfrecidos',
                nombre: 'Materiales Ofrecidos',
                color: theme.palette.primary.main
              },
              {
                dataKey: 'mejoresPreciosCantidad',
                nombre: 'Mejores Precios',
                color: theme.palette.success.main
              }
            ]}
            config={{
              titulo: 'Ranking de Proveedores',
              subtitulo: 'Comparativa de materiales ofrecidos y mejores precios',
              ejeXKey: 'nombre',
              ejeXAngulo: -45,
              nombreEjeX: 'Proveedor',
              nombreEjeY: 'Cantidad',
              margen: { top: 20, right: 30, left: 20, bottom: 80 }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalisisMaterialesPage;