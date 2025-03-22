import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import HomeIcon from '@mui/icons-material/Home';
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useAuth } from '../context/AuthContext';
import { useNavbarHeight } from '../context/NavbarHeightContext';

const menuItemsData = {
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { name: 'Proyectos', path: '/proyectos', icon: <BusinessIcon /> },
    { 
      name: 'Recursos', 
      icon: <Inventory2Icon />,
      children: [
        { name: 'Materiales', path: '/materiales', icon: <Inventory2Icon /> },
        { name: 'Proveedores', path: '/proveedores', icon: <LocalShippingIcon /> },
      ]
    },
    {
      name: 'Configuración',
      icon: <AdminPanelSettingsIcon />,
      children: [
        { name: 'Usuarios', path: '/usuarios', icon: <PeopleIcon /> },
        { name: 'Roles', path: '/roles', icon: <AdminPanelSettingsIcon /> },
      ],
    },
  ],
  DIRECTOR: [
    { name: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { name: 'Proyectos', path: '/proyectos', icon: <BusinessIcon /> },
    { name: 'Asignaciones', path: '/asignaciones', icon: <PeopleIcon /> },
    { 
      name: 'Recursos', 
      icon: <Inventory2Icon />,
      children: [
        { name: 'Materiales', path: '/materiales', icon: <Inventory2Icon /> },
        { name: 'Proveedores', path: '/proveedores', icon: <LocalShippingIcon /> },
      ]
    },
  ],
  GESTOR: [
    { name: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { name: 'Proyectos', path: '/proyectos', icon: <BusinessIcon /> },
    { name: 'Tareas', path: '/tareas', icon: <AssignmentIcon /> },
    { name: 'Materiales', path: '/materiales', icon: <Inventory2Icon /> },
  ],
  USER: [
    { name: 'Dashboard', path: '/', icon: <HomeIcon /> },
    { name: 'Mis Tareas', path: '/mis-tareas', icon: <EngineeringIcon /> },
  ],
};

const Sidebar = ({ onWidthChange }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { navbarHeight } = useNavbarHeight();
  const [pinned, setPinned] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Ancho del Drawer según el estado "expanded"
  const drawerWidth = expanded ? 250 : 60;
  
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(drawerWidth);
    }
  }, [drawerWidth, onWidthChange]);

  // Función recursiva para renderizar los items de menú con indentación según el nivel.
  const renderMenuItems = (itemsArray, level = 0) => {
    return itemsArray.map(item => {
      if (item.children) {
        const isOpen = openSubmenus[item.name] || false;
        return (
          <React.Fragment key={item.name}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  setOpenSubmenus(prev => ({ ...prev, [item.name]: !isOpen }))
                }
                sx={{
                  pl: expanded ? level * 2 : 0,
                  justifyContent: expanded ? 'initial' : 'center'
                }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40, ml: 1 }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                {expanded && <ListItemText primary={item.name} />}
                {expanded && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={isOpen && expanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, level + 1)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      } else {
        return (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                pl: expanded ? level * 2 : 0,
                justifyContent: expanded ? 'initial' : 'center'
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40, ml: 1 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              {expanded && <ListItemText primary={item.name} />}
            </ListItemButton>
          </ListItem>
        );
      }
    });
  };

  let items = [];
  if (user) {
    // Verificar si el usuario es superusuario para darle acceso a todo
    if (user.esSuperUsuario) {
      items = menuItemsData.ADMIN;
    } else {
      const roles = user.roles || [];
      roles.forEach(role => {
        const upperRole = role.toUpperCase();
        if (menuItemsData[upperRole]) {
          // Evitar duplicados al combinar menús de diferentes roles
          menuItemsData[upperRole].forEach(item => {
            if (!items.some(existingItem => existingItem.name === item.name)) {
              items.push(item);
            }
          });
        }
      });
      
      // Si no tiene roles específicos, asignar menú básico
      if (items.length === 0) {
        items = menuItemsData.USER;
      }
    }
  }

  return user ? (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: drawerWidth,
          top: `${navbarHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRight: '1px solid rgba(0,0,0,0.12)',
          pt: 2,
          pb: 2,
        },
        onMouseEnter: () => { if (!pinned) setExpanded(true); },
        onMouseLeave: () => { if (!pinned) setExpanded(false); },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: expanded ? 'flex-end' : 'center', pr: expanded ? 1 : 0 }}>
        {expanded && (
          <IconButton onClick={() => { setPinned(prev => !prev); if (!pinned) setExpanded(true); }} sx={{ color: theme.palette.primary.contrastText }}>
            <PushPinIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {renderMenuItems(items)}
      </List>
    </Drawer>
  ) : null;
};

export default Sidebar;