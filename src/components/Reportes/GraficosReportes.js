import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';

/**
 * Componente reutilizable para renderizar diferentes tipos de gráficos
 * 
 * @param {string} tipo - Tipo de gráfico: 'barras', 'lineas', 'circular', 'area', 'radar'
 * @param {Array} datos - Array de datos para el gráfico
 * @param {Array} series - Configuración de las series de datos
 * @param {Object} config - Configuración adicional del gráfico
 * @param {number} height - Altura del gráfico en píxeles
 * @param {boolean} loading - Indica si los datos están cargando
 * @param {string} error - Mensaje de error, si existe
 * @param {string} emptyMessage - Mensaje a mostrar cuando no hay datos
 */
const GraficosReportes = ({
  tipo = 'barras',
  datos = [],
  series = [],
  config = {},
  height = 400,
  loading = false,
  error = null,
  emptyMessage = 'No hay datos disponibles para mostrar en el gráfico.'
}) => {
  const theme = useTheme();

  // Colores por defecto para los gráficos
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Función para obtener el color de una serie
  const getSerieColor = (index) => {
    if (series[index]?.color) {
      return series[index].color;
    }
    return COLORS[index % COLORS.length];
  };

  // Manejador de estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  // Manejador de error
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Manejador de datos vacíos
  if (!datos || datos.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        {emptyMessage}
      </Alert>
    );
  }

  // Configuraciones por defecto
  const {
    titulo,
    subtitulo,
    nombreEjeX = '',
    nombreEjeY = '',
    mostrarLeyenda = true,
    mostrarTooltip = true,
    mostrarGrid = true,
    ejeXAngulo = 0,
    margen = { top: 20, right: 30, left: 20, bottom: 30 }
  } = config;

  // Renderiza el título y subtítulo si están presentes
  const renderHeader = () => {
    if (!titulo && !subtitulo) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        {titulo && (
          <Typography variant="h6" gutterBottom>
            {titulo}
          </Typography>
        )}
        {subtitulo && (
          <Typography variant="body2" color="text.secondary">
            {subtitulo}
          </Typography>
        )}
      </Box>
    );
  };

  // Renderiza el gráfico según el tipo
  const renderGrafico = () => {
    switch (tipo.toLowerCase()) {
      case 'barras':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={datos} margin={margen}>
              {mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey={config.ejeXKey || 'name'} 
                angle={ejeXAngulo} 
                textAnchor={ejeXAngulo !== 0 ? 'end' : 'middle'}
                height={ejeXAngulo !== 0 ? 70 : 30}
                label={nombreEjeX ? { value: nombreEjeX, position: 'bottom', offset: 0 } : null}
              />
              <YAxis label={nombreEjeY ? { value: nombreEjeY, angle: -90, position: 'left' } : null} />
              {mostrarTooltip && <Tooltip />}
              {mostrarLeyenda && <Legend />}
              
              {series.map((serie, index) => (
                <Bar 
                  key={index}
                  dataKey={serie.dataKey}
                  name={serie.nombre}
                  fill={getSerieColor(index)}
                  stackId={serie.apilar ? 'stack' : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'lineas':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={datos} margin={margen}>
              {mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey={config.ejeXKey || 'name'} 
                angle={ejeXAngulo} 
                textAnchor={ejeXAngulo !== 0 ? 'end' : 'middle'}
                height={ejeXAngulo !== 0 ? 70 : 30}
                label={nombreEjeX ? { value: nombreEjeX, position: 'bottom', offset: 0 } : null}
              />
              <YAxis label={nombreEjeY ? { value: nombreEjeY, angle: -90, position: 'left' } : null} />
              {mostrarTooltip && <Tooltip />}
              {mostrarLeyenda && <Legend />}
              
              {series.map((serie, index) => (
                <Line 
                  key={index}
                  type={serie.tipo || 'monotone'}
                  dataKey={serie.dataKey}
                  name={serie.nombre}
                  stroke={getSerieColor(index)}
                  strokeWidth={serie.grosor || 2}
                  dot={serie.mostrarPuntos !== false}
                  activeDot={serie.mostrarPuntos !== false ? { r: 8 } : false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={datos} margin={margen}>
              {mostrarGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis 
                dataKey={config.ejeXKey || 'name'} 
                angle={ejeXAngulo} 
                textAnchor={ejeXAngulo !== 0 ? 'end' : 'middle'}
                height={ejeXAngulo !== 0 ? 70 : 30}
                label={nombreEjeX ? { value: nombreEjeX, position: 'bottom', offset: 0 } : null}
              />
              <YAxis label={nombreEjeY ? { value: nombreEjeY, angle: -90, position: 'left' } : null} />
              {mostrarTooltip && <Tooltip />}
              {mostrarLeyenda && <Legend />}
              
              {series.map((serie, index) => (
                <Area 
                  key={index}
                  type={serie.tipo || 'monotone'}
                  dataKey={serie.dataKey}
                  name={serie.nombre}
                  fill={getSerieColor(index)}
                  stroke={getSerieColor(index)}
                  fillOpacity={serie.opacidad || 0.3}
                  stackId={serie.apilar ? 'stack' : undefined}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'circular':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={datos}
                cx="50%"
                cy="50%"
                labelLine={config.mostrarLineasEtiquetas !== false}
                outerRadius={config.radioExterno || height / 2 - 50}
                innerRadius={config.radioInterno || 0}
                fill="#8884d8"
                dataKey={config.dataKey || 'value'}
                nameKey={config.nameKey || 'name'}
                label={config.mostrarEtiquetas !== false ? 
                  (({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`) : 
                  false
                }
              >
                {datos.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              {mostrarTooltip && <Tooltip formatter={(value, name) => [value, name]} />}
              {mostrarLeyenda && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={datos}>
              <PolarGrid />
              <PolarAngleAxis dataKey={config.categoryKey || 'name'} />
              <PolarRadiusAxis angle={config.radiusAxisAngle || 90} domain={config.domain} />
              
              {series.map((serie, index) => (
                <Radar 
                  key={index}
                  name={serie.nombre}
                  dataKey={serie.dataKey}
                  stroke={getSerieColor(index)}
                  fill={getSerieColor(index)}
                  fillOpacity={serie.opacidad || 0.2}
                />
              ))}
              
              {mostrarTooltip && <Tooltip />}
              {mostrarLeyenda && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <Alert severity="warning">
            Tipo de gráfico '{tipo}' no soportado.
          </Alert>
        );
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }} elevation={1}>
      {renderHeader()}
      {renderGrafico()}
    </Paper>
  );
};

export default GraficosReportes;