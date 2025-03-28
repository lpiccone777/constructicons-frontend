import React, { useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNavbarHeight } from '../context/NavbarHeightContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { setNavbarHeight } = useNavbarHeight();
  const navbarRef = useRef(null);
  const defaultNavbarHeight = 64;

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.clientHeight || defaultNavbarHeight);
    }
  }, [setNavbarHeight]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
<AppBar
  ref={navbarRef}
  position="fixed"
  elevation={0}
  sx={{
    top: 0,
    left: 0,
    right: 0,
    boxShadow: 'none', // eliminar sombra para unificar visualmente (opcional)
    borderRadius: 0, // asegurar sin borde redondeado
    m: 0, // margen reset
    p: 0, // padding reset
    zIndex: (theme) => theme.zIndex.drawer + 1,
  }}
>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Constructicons</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {user.email}
            </Typography>
          </Box>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;