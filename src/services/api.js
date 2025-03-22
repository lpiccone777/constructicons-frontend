import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Configurar instancia de axios con URL base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token en solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API de proyectos
const proyectosApi = {
  // Obtener todos los proyectos
  getProyectos: async () => {
    const response = await apiClient.get('/proyectos');
    return response.data;
  },
  
  // Obtener un proyecto específico
  getProyecto: async (id) => {
    const response = await apiClient.get(`/proyectos/${id}`);
    return response.data;
  },
  
  // Crear un nuevo proyecto
  createProyecto: async (proyectoData) => {
    const response = await apiClient.post('/proyectos', proyectoData);
    return response.data;
  },
  
  // Actualizar un proyecto existente
  updateProyecto: async (id, proyectoData) => {
    const response = await apiClient.put(`/proyectos/${id}`, proyectoData);
    return response.data;
  },
  
  // Eliminar un proyecto
  deleteProyecto: async (id) => {
    const response = await apiClient.delete(`/proyectos/${id}`);
    return response.data;
  },
  
  // Obtener estadísticas de proyectos
  getEstadisticas: async () => {
    const response = await apiClient.get('/proyectos/stats');
    return response.data;
  }
};

// API de etapas
const etapasApi = {
  // Obtener todas las etapas de un proyecto
  getEtapas: async (proyectoId) => {
    const response = await apiClient.get('/etapas', { params: { proyectoId } });
    return response.data;
  },
  
  // Obtener una etapa específica
  getEtapa: async (id) => {
    const response = await apiClient.get(`/etapas/${id}`);
    return response.data;
  },
  
  // Crear una nueva etapa
  createEtapa: async (etapaData) => {
    const response = await apiClient.post('/etapas', etapaData);
    return response.data;
  },
  
  // Actualizar una etapa existente
  updateEtapa: async (id, etapaData) => {
    const response = await apiClient.put(`/etapas/${id}`, etapaData);
    return response.data;
  },
  
  // Eliminar una etapa
  deleteEtapa: async (id) => {
    const response = await apiClient.delete(`/etapas/${id}`);
    return response.data;
  },
  
  // Reordenar etapas
  reordenarEtapas: async (proyectoId, ordenesData) => {
    const response = await apiClient.post(`/etapas/reordenar/${proyectoId}`, ordenesData);
    return response.data;
  }
};

// API de tareas
const tareasApi = {
  // Obtener todas las tareas de una etapa
  getTareas: async (etapaId) => {
    const response = await apiClient.get('/tareas', { params: { etapaId } });
    return response.data;
  },
  
  // Obtener una tarea específica
  getTarea: async (id) => {
    const response = await apiClient.get(`/tareas/${id}`);
    return response.data;
  },
  
  // Crear una nueva tarea
  createTarea: async (tareaData) => {
    const response = await apiClient.post('/tareas', tareaData);
    return response.data;
  },
  
  // Actualizar una tarea existente
  updateTarea: async (id, tareaData) => {
    const response = await apiClient.put(`/tareas/${id}`, tareaData);
    return response.data;
  },
  
  // Eliminar una tarea
  deleteTarea: async (id) => {
    const response = await apiClient.delete(`/tareas/${id}`);
    return response.data;
  },
  
  // Reordenar tareas
  reordenarTareas: async (etapaId, ordenesData) => {
    const response = await apiClient.post(`/tareas/reordenar/${etapaId}`, ordenesData);
    return response.data;
  }
};

// API de usuarios
const usersApi = {
  // Obtener todos los usuarios
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  
  // Obtener un usuario específico
  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  // Crear un nuevo usuario
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  
  // Actualizar un usuario existente
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  
  // Eliminar un usuario
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};

// API de asignaciones
const asignacionesApi = {
  // Obtener asignaciones de proyecto
  getAsignacionesProyecto: async (proyectoId, usuarioId) => {
    const params = {};
    if (proyectoId) params.proyectoId = proyectoId;
    if (usuarioId) params.usuarioId = usuarioId;
    
    const response = await apiClient.get('/asignaciones/proyectos', { params });
    return response.data;
  },
  
  // Crear una asignación de proyecto
  createAsignacionProyecto: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones/proyectos', asignacionData);
    return response.data;
  },
  
  // Actualizar una asignación de proyecto
  updateAsignacionProyecto: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones/proyectos/${id}`, asignacionData);
    return response.data;
  },
  
  // Eliminar una asignación de proyecto
  deleteAsignacionProyecto: async (id) => {
    const response = await apiClient.delete(`/asignaciones/proyectos/${id}`);
    return response.data;
  },
  
  // Obtener asignaciones de tarea
  getAsignacionesTarea: async (tareaId, usuarioId) => {
    const params = {};
    if (tareaId) params.tareaId = tareaId;
    if (usuarioId) params.usuarioId = usuarioId;
    
    const response = await apiClient.get('/asignaciones/tareas', { params });
    return response.data;
  },
  
  // Crear una asignación de tarea
  createAsignacionTarea: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones/tareas', asignacionData);
    return response.data;
  },
  
  // Actualizar una asignación de tarea
  updateAsignacionTarea: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones/tareas/${id}`, asignacionData);
    return response.data;
  },
  
  // Eliminar una asignación de tarea
  deleteAsignacionTarea: async (id) => {
    const response = await apiClient.delete(`/asignaciones/tareas/${id}`);
    return response.data;
  }
};

// API de materiales
const materialesApi = {
  // Obtener todos los materiales
  getMateriales: async (categoria) => {
    const params = {};
    if (categoria) params.categoria = categoria;
    
    const response = await apiClient.get('/materiales', { params });
    return response.data;
  },
  
  // Obtener un material específico
  getMaterial: async (id) => {
    const response = await apiClient.get(`/materiales/${id}`);
    return response.data;
  },
  
  // Crear un nuevo material
  createMaterial: async (materialData) => {
    const response = await apiClient.post('/materiales', materialData);
    return response.data;
  },
  
  // Actualizar un material existente
  updateMaterial: async (id, materialData) => {
    const response = await apiClient.put(`/materiales/${id}`, materialData);
    return response.data;
  },
  
  // Eliminar un material
  deleteMaterial: async (id) => {
    const response = await apiClient.delete(`/materiales/${id}`);
    return response.data;
  },
  
  // Obtener categorías de materiales
  getCategoriasMateriales: async () => {
    const response = await apiClient.get('/materiales/categorias');
    return response.data;
  }
};

// API de proveedores
const proveedoresApi = {
  // Obtener todos los proveedores
  getProveedores: async (categoria) => {
    const params = {};
    if (categoria) params.categoria = categoria;
    
    const response = await apiClient.get('/proveedores', { params });
    return response.data;
  },
  
  // Obtener un proveedor específico
  getProveedor: async (id) => {
    const response = await apiClient.get(`/proveedores/${id}`);
    return response.data;
  },
  
  // Crear un nuevo proveedor
  createProveedor: async (proveedorData) => {
    const response = await apiClient.post('/proveedores', proveedorData);
    return response.data;
  },
  
  // Actualizar un proveedor existente
  updateProveedor: async (id, proveedorData) => {
    const response = await apiClient.put(`/proveedores/${id}`, proveedorData);
    return response.data;
  },
  
  // Eliminar un proveedor
  deleteProveedor: async (id) => {
    const response = await apiClient.delete(`/proveedores/${id}`);
    return response.data;
  },
  
  // Obtener contactos de un proveedor
  getContactos: async (proveedorId) => {
    const response = await apiClient.get(`/proveedores/${proveedorId}/contactos`);
    return response.data;
  },
  
  // Obtener un contacto específico
  getContacto: async (id) => {
    const response = await apiClient.get(`/proveedores/contactos/${id}`);
    return response.data;
  },
  
  // Crear un nuevo contacto
  createContacto: async (contactoData) => {
    const response = await apiClient.post('/proveedores/contactos', contactoData);
    return response.data;
  },
  
  // Actualizar un contacto existente
  updateContacto: async (id, contactoData) => {
    const response = await apiClient.put(`/proveedores/contactos/${id}`, contactoData);
    return response.data;
  },
  
  // Eliminar un contacto
  deleteContacto: async (id) => {
    const response = await apiClient.delete(`/proveedores/contactos/${id}`);
    return response.data;
  }
};

// API de asignaciones de materiales
const asignacionesMaterialesApi = {
  // Obtener todas las asignaciones de materiales
  getAsignacionesMateriales: async (tareaId, materialId, estado) => {
    const params = {};
    if (tareaId) params.tareaId = tareaId;
    if (materialId) params.materialId = materialId;
    if (estado) params.estado = estado;
    
    const response = await apiClient.get('/asignaciones-materiales', { params });
    return response.data;
  },
  
  // Obtener una asignación de material específica
  getAsignacionMaterial: async (id) => {
    const response = await apiClient.get(`/asignaciones-materiales/${id}`);
    return response.data;
  },
  
  // Crear una nueva asignación de material
  createAsignacionMaterial: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones-materiales', asignacionData);
    return response.data;
  },
  
  // Actualizar una asignación de material existente
  updateAsignacionMaterial: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones-materiales/${id}`, asignacionData);
    return response.data;
  },
  
  // Eliminar una asignación de material
  deleteAsignacionMaterial: async (id) => {
    const response = await apiClient.delete(`/asignaciones-materiales/${id}`);
    return response.data;
  },
  
  // Obtener resumen de materiales por proyecto
  getResumenMaterialesPorProyecto: async (proyectoId) => {
    const response = await apiClient.get(`/asignaciones-materiales/proyecto/${proyectoId}/resumen`);
    return response.data;
  }
};

const materialesProveedores: {
  // Obtener todas las relaciones material-proveedor
  getMaterialesProveedores: async (materialId, proveedorId) => {
    const params = {};
    if (materialId) params.materialId = materialId;
    if (proveedorId) params.proveedorId = proveedorId;
    
    const response = await apiClient.get('/materiales-proveedores', { params });
    return response.data;
  },
  
  // Obtener una relación material-proveedor específica
  getMaterialProveedor: async (id) => {
    const response = await apiClient.get(`/materiales-proveedores/${id}`);
    return response.data;
  },
  
  // Crear una nueva relación material-proveedor
  createMaterialProveedor: async (data) => {
    const response = await apiClient.post('/materiales-proveedores', data);
    return response.data;
  },
  
  // Actualizar una relación material-proveedor existente
  updateMaterialProveedor: async (id, data) => {
    const response = await apiClient.put(`/materiales-proveedores/${id}`, data);
    return response.data;
  },
  
  // Eliminar una relación material-proveedor
  deleteMaterialProveedor: async (id) => {
    const response = await apiClient.delete(`/materiales-proveedores/${id}`);
    return response.data;
  },
  
  // Obtener comparativa de proveedores para un material
  getComparativaProveedores: async (materialId) => {
    const response = await apiClient.get(`/materiales-proveedores/material/${materialId}/comparativa`);
    return response.data;
  }
};

export default {
  proyectos: proyectosApi,
  etapas: etapasApi,
  tareas: tareasApi,
  users: usersApi,
  asignaciones: asignacionesApi,
  materiales: materialesApi,
  proveedores: proveedoresApi,
  asignacionesMateriales: asignacionesMaterialesApi,
  
  // Autenticación
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  checkToken: async () => {
    const response = await apiClient.get('/auth/check-token');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }
};