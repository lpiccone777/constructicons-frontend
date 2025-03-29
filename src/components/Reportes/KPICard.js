import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const KPICard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        padding: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderLeft: `4px solid ${color || theme.palette.primary.main}` 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && (
          <Box 
            sx={{ 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center', 
              color: color || theme.palette.primary.main 
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default KPICard;