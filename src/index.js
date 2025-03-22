import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { NavbarHeightProvider } from './context/NavbarHeightContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
      light: '#81b5f0',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#50E3C2',
      light: '#84ffff',
      dark: '#00b0a1',
      contrastText: '#000000',
    },
    success: {
      main: '#66BB6A',
      light: '#98ee99',
      dark: '#338a3e',
    },
    warning: {
      main: '#FFA726',
      light: '#ffd95b',
      dark: '#c77800',
    },
    error: {
      main: '#F44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <NavbarHeightProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </NavbarHeightProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();