import React from 'react';
import { Box, Typography } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import SelectorReportes from '../../components/Reportes/SelectorReportes';
import DashboardEjecutivoPage from './DashboardEjecutivoPage';
import AnalisisMaterialesPage from './AnalisisMaterialesPage';
import AvanceProyectoPage from './AvanceProyectoPage';
import RecursosHumanosPage from './RecursosHumanosPage';

const ReportesPage = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard-ejecutivo" replace />} />
        <Route 
          path="dashboard-ejecutivo" 
          element={
            <>
              <SelectorReportes />
              <DashboardEjecutivoPage />
            </>
          } 
        />
        <Route 
          path="analisis-materiales" 
          element={
            <>
              <SelectorReportes />
              <AnalisisMaterialesPage />
            </>
          } 
        />
        <Route 
          path="avance-proyecto" 
          element={
            <>
              <SelectorReportes />
              <AvanceProyectoPage />
            </>
          } 
        />
        <Route 
          path="recursos-humanos" 
          element={
            <>
              <SelectorReportes />
              <RecursosHumanosPage />
            </>
          } 
        />
      </Routes>
    </Box>
  );
};

export default ReportesPage;