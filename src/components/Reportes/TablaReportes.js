import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Componente reutilizable para mostrar datos tabulares con funcionalidades avanzadas
 * 
 * @param {Array} datos - Array de datos para la tabla
 * @param {Array} columnas - Configuración de las columnas
 * @param {Object} config - Configuración adicional de la tabla
 * @param {boolean} loading - Indica si los datos están cargando
 * @param {string} error - Mensaje de error, si existe
 * @param {string} emptyMessage - Mensaje a mostrar cuando no hay datos
 */
const TablaReportes = ({
  datos = [],
  columnas = [],
  config = {},
  loading = false,
  error = null,
  emptyMessage = 'No hay datos disponibles para mostrar en la tabla.'
}) => {
  // Estados para manejo de paginación, ordenamiento y filtrado
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(config.filasPorPagina || 10);
  const [orderBy, setOrderBy] = useState(config.ordenInicial?.campo || '');
  const [order, setOrder] = useState(config.ordenInicial?.tipo || 'asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Configuración
  const {
    titulo,
    subtitulo,
    mostrarBuscador = true,
    mostrarPaginacion = true,
    seleccionable = false,
    onSelectionChange,
    buscadorPlaceholder = 'Buscar...',
    zebraPattern = true
  } = config;

  // Función para ordenar datos
  const descendingComparator = (a, b, orderBy) => {
    // Manejar propiedades anidadas (usando notación de punto)
    const getNestedProperty = (obj, path) => {
      return path.split('.').reduce((acc, part) => 
        acc && acc[part] !== undefined ? acc[part] : null, obj);
    };
    
    const aValue = getNestedProperty(a, orderBy);
    const bValue = getNestedProperty(b, orderBy);
    
    // Validación para evitar comparar undefined o null
    if (!aValue && aValue !== 0) return 1;
    if (!bValue && bValue !== 0) return -1;
    
    // Comparación según tipo de dato
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return bValue - aValue;
    }
    
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Solicitar cambio de orden
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Cambiar página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambiar filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar la selección de filas
  const handleRowSelect = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, id];
    } else {
      newSelected = selectedRows.filter(rowId => rowId !== id);
    }

    setSelectedRows(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  // Filtrar datos basados en término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return datos;

    return datos.filter(row => {
      // Función para obtener propiedades anidadas
      const getNestedProperty = (obj, path) => {
        return path.split('.').reduce((acc, part) => 
          acc && acc[part] !== undefined ? acc[part] : undefined, obj);
      };
      
      return columnas.some(columna => {
        const valueToSearch = getNestedProperty(row, columna.id);
        if (valueToSearch === null || valueToSearch === undefined) return false;
        
        return String(valueToSearch).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [datos, columnas, searchTerm]);

  // Ordenar y paginar los datos filtrados
  const sortedAndPaginatedData = useMemo(() => {
    const sortedData = orderBy 
      ? [...filteredData].sort(getComparator(order, orderBy))
      : filteredData;
    
    return mostrarPaginacion
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;
  }, [filteredData, orderBy, order, page, rowsPerPage, mostrarPaginacion]);

  // Renderizar encabezado
  const renderHeader = () => {
    if (!titulo && !subtitulo && !mostrarBuscador) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        {titulo && (
          <Typography variant="h6" gutterBottom>
            {titulo}
          </Typography>
        )}
        {subtitulo && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitulo}
          </Typography>
        )}
        {mostrarBuscador && (
          <TextField
            size="small"
            placeholder={buscadorPlaceholder}
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
            sx={{ mb: 2 }}
          />
        )}
      </Box>
    );
  };

  // Renderizar celda según tipo
  const renderCell = (row, columna) => {
    // Función para obtener propiedades anidadas
    const getNestedProperty = (obj, path) => {
      return path.split('.').reduce((acc, part) => 
        acc && acc[part] !== undefined ? acc[part] : null, obj);
    };
    
    const value = getNestedProperty(row, columna.id);
    
    // Si no hay valor, mostrar un texto por defecto
    if (value === null || value === undefined) {
      return columna.defaultContent || '-';
    }
    
    // Si hay un renderizador personalizado, usarlo
    if (columna.renderCell) {
      return columna.renderCell(value, row);
    }
    
    // Renderizar según tipo de dato
    switch (columna.tipo) {
      case 'numero':
        return value.toLocaleString('es-AR', columna.opciones);
      
      case 'moneda':
        return `$${value.toLocaleString('es-AR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2,
          ...columna.opciones
        })}`;
      
      case 'porcentaje':
        return `${value.toLocaleString('es-AR', { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 1,
          ...columna.opciones
        })}%`;
      
      case 'fecha':
        const date = new Date(value);
        return date.toLocaleDateString('es-AR', columna.opciones);
      
      case 'estado':
        return (
          <Chip 
            label={value} 
            size="small" 
            color={columna.colores?.[value] || 'default'}
            variant={columna.variante || 'filled'}
          />
        );
      
      case 'booleano':
        return value ? 'Sí' : 'No';
      
      case 'indicador':
        const thresholds = columna.umbrales || { 
          critico: null, 
          advertencia: null, 
          normal: null 
        };
        
        let color = 'default';
        if (thresholds.critico !== null && 
            ((columna.indicadorInvertido && value < thresholds.critico) || 
             (!columna.indicadorInvertido && value > thresholds.critico))) {
          color = 'error';
        } else if (thresholds.advertencia !== null && 
                  ((columna.indicadorInvertido && value < thresholds.advertencia) || 
                   (!columna.indicadorInvertido && value > thresholds.advertencia))) {
          color = 'warning';
        } else if (thresholds.normal !== null) {
          color = 'success';
        }
        
        return (
          <Chip 
            label={value.toLocaleString('es-AR', columna.opciones)} 
            size="small" 
            color={color}
            variant={columna.variante || 'filled'}
          />
        );
      
      default:
        return String(value);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Sin datos
  if (!datos || datos.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%' }} elevation={1}>
      <Box p={3}>
        {renderHeader()}
        
        <TableContainer>
          <Table stickyHeader aria-label="tabla de reportes">
            <TableHead>
              <TableRow>
                {columnas.map(columna => (
                  <TableCell 
                    key={columna.id}
                    align={columna.align || 'left'}
                    sortDirection={orderBy === columna.id ? order : false}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {columna.ordenable !== false ? (
                      <TableSortLabel
                        active={orderBy === columna.id}
                        direction={orderBy === columna.id ? order : 'asc'}
                        onClick={() => handleRequestSort(columna.id)}
                      >
                        {columna.etiqueta}
                      </TableSortLabel>
                    ) : (
                      columna.etiqueta
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndPaginatedData.length > 0 ? (
                sortedAndPaginatedData.map((row, index) => {
                  const isSelected = selectedRows.includes(row.id);
                  
                  return (
                    <TableRow
                      hover
                      key={row.id || index}
                      onClick={seleccionable ? () => handleRowSelect(row.id) : undefined}
                      selected={isSelected}
                      sx={{
                        cursor: seleccionable ? 'pointer' : 'default',
                        backgroundColor: zebraPattern && index % 2 !== 0 ? 'rgba(0, 0, 0, 0.03)' : 'inherit',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        },
                      }}
                    >
                      {columnas.map(columna => (
                        <TableCell 
                          key={`${row.id || index}-${columna.id}`}
                          align={columna.align || 'left'}
                          sx={columna.cellStyle ? columna.cellStyle(row[columna.id], row) : undefined}
                        >
                          {renderCell(row, columna)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columnas.length} align="center">
                    No se encontraron resultados para "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {mostrarPaginacion && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        )}
      </Box>
    </Paper>
  );
};

export default TablaReportes;