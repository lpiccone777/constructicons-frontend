import React from 'react';
import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ExportarPDFButton = ({ titulo }) => {
  const handleExport = () => {
    // Simulación de exportación a PDF
    console.log(`Exportando ${titulo} a PDF...`);
    setTimeout(() => {
      alert(`El reporte "${titulo}" ha sido exportado a PDF correctamente.`);
    }, 1000);
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<PictureAsPdfIcon />}
      onClick={handleExport}
      size="small"
    >
      Exportar PDF
    </Button>
  );
};

export default ExportarPDFButton;