import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Error de login:', err);
      setError('Credenciales incorrectas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 2 
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Constructicons
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sistema de Gestión de Proyectos
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;