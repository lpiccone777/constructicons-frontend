import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Configurar el token para todas las solicitudes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Decodificar el token para obtener la información del usuario
          const decoded = jwtDecode(token);
          
          // Verificar si el token está expirado
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token expirado
            logout();
          } else {
            // Validar el token con el backend
            const response = await axios.get('http://localhost:3000/auth/check-token');
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Error al inicializar la autenticación:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });
      
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setToken(access_token);
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    token,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};