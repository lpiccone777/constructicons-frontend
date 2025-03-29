import React from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const SelectorReportes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPathValue = () => {
    const path = location.pathname;
    if (path.includes('dashboard-ejecutivo')) return 0;
    if (path.includes('analisis-materiales')) return 1;
    if (path.includes('avance-proyecto')) return 2;
    if (path.includes('recursos-humanos')) return 3;
    return 0;
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/reportes/dashboard-ejecutivo');
        break;
      case 1:
        navigate('/reportes/analisis-materiales');
        break;
      case 2:
        navigate('/reportes/avance-proyecto');
        break;
      case 3:
        navigate('/reportes/recursos-humanos');
        break;
      default:
        navigate('/reportes/dashboard-ejecutivo');
    }
  };

  return (
    <Paper sx={{ mb: 3 }}>
      <Tabs
        value={getPathValue()}
        onChange={handleChange}
        variant="fullWidth"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab icon={<DashboardIcon />} label="Dashboard Ejecutivo" />
        <Tab icon={<InventoryIcon />} label="Análisis de Materiales" />
        <Tab icon={<AssessmentIcon />} label="Avance de Proyecto" />
        <Tab icon={<PeopleAltIcon />} label="Recursos Humanos" />
      </Tabs>
    </Paper>
  );
};

export default SelectorReportes;