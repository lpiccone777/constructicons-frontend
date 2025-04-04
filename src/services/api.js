import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Configurar instancia de axios con URL base y encabezados
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

/* --------------------- Endpoints Originales --------------------- */

// API de proyectos
const proyectosApi = {
  getProyectos: async () => {
    const response = await apiClient.get('/proyectos');
    return response.data;
  },
  getProyecto: async (id) => {
    const response = await apiClient.get(`/proyectos/${id}`);
    return response.data;
  },
  createProyecto: async (proyectoData) => {
    const response = await apiClient.post('/proyectos', proyectoData);
    return response.data;
  },
  updateProyecto: async (id, proyectoData) => {
    const response = await apiClient.put(`/proyectos/${id}`, proyectoData);
    return response.data;
  },
  deleteProyecto: async (id) => {
    const response = await apiClient.delete(`/proyectos/${id}`);
    return response.data;
  },
  getEstadisticas: async () => {
    const response = await apiClient.get('/proyectos/stats');
    return response.data;
  },
  getEmpleadosProyecto: async (proyectoId) => {
    const response = await apiClient.get(`/proyectos/${proyectoId}/empleados`);
    return response.data;
  }
};

// API de etapas
const etapasApi = {
  getEtapas: async (proyectoId) => {
    const response = await apiClient.get('/etapas', { params: { proyectoId } });
    return response.data;
  },
  getEtapa: async (id) => {
    const response = await apiClient.get(`/etapas/${id}`);
    return response.data;
  },
  createEtapa: async (etapaData) => {
    const response = await apiClient.post('/etapas', etapaData);
    return response.data;
  },
  updateEtapa: async (id, etapaData) => {
    const response = await apiClient.put(`/etapas/${id}`, etapaData);
    return response.data;
  },
  deleteEtapa: async (id) => {
    const response = await apiClient.delete(`/etapas/${id}`);
    return response.data;
  },
  reordenarEtapas: async (proyectoId, ordenesData) => {
    const response = await apiClient.post(`/etapas/reordenar/${proyectoId}`, ordenesData);
    return response.data;
  }
};

// API de tareas
const tareasApi = {
  getTareas: async (etapaId) => {
    const response = await apiClient.get('/tareas', { params: { etapaId } });
    return response.data;
  },
  getTarea: async (id) => {
    const response = await apiClient.get(`/tareas/${id}`);
    return response.data;
  },
  createTarea: async (tareaData) => {
    const response = await apiClient.post('/tareas', tareaData);
    return response.data;
  },
  updateTarea: async (id, tareaData) => {
    const response = await apiClient.put(`/tareas/${id}`, tareaData);
    return response.data;
  },
  deleteTarea: async (id) => {
    const response = await apiClient.delete(`/tareas/${id}`);
    return response.data;
  },
  reordenarTareas: async (etapaId, ordenesData) => {
    const response = await apiClient.post(`/tareas/reordenar/${etapaId}`, ordenesData);
    return response.data;
  }
};

// API de usuarios
const usersApi = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
};

// API de asignaciones de proyectos y tareas
const asignacionesApi = {
  // Asignaciones de proyecto
  getAsignacionesProyecto: async (proyectoId, usuarioId) => {
    const params = {};
    if (proyectoId) params.proyectoId = proyectoId;
    if (usuarioId) params.usuarioId = usuarioId;
    const response = await apiClient.get('/asignaciones/proyectos', { params });
    return response.data;
  },
  createAsignacionProyecto: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones/proyectos', asignacionData);
    return response.data;
  },
  updateAsignacionProyecto: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones/proyectos/${id}`, asignacionData);
    return response.data;
  },
  deleteAsignacionProyecto: async (id) => {
    const response = await apiClient.delete(`/asignaciones/proyectos/${id}`);
    return response.data;
  },
  // Asignaciones de tarea
  getAsignacionesTarea: async (tareaId, usuarioId) => {
    const params = {};
    if (tareaId) params.tareaId = tareaId;
    if (usuarioId) params.usuarioId = usuarioId;
    const response = await apiClient.get('/asignaciones/tareas', { params });
    return response.data;
  },
  createAsignacionTarea: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones/tareas', asignacionData);
    return response.data;
  },
  updateAsignacionTarea: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones/tareas/${id}`, asignacionData);
    return response.data;
  },
  deleteAsignacionTarea: async (id) => {
    const response = await apiClient.delete(`/asignaciones/tareas/${id}`);
    return response.data;
  }
};

// API de materiales
const materialesApi = {
  getMateriales: async (categoria) => {
    const params = {};
    if (categoria) params.categoria = categoria;
    const response = await apiClient.get('/materiales', { params });
    return response.data;
  },
  getMaterial: async (id) => {
    const response = await apiClient.get(`/materiales/${id}`);
    return response.data;
  },
  createMaterial: async (materialData) => {
    const response = await apiClient.post('/materiales', materialData);
    return response.data;
  },
  updateMaterial: async (id, materialData) => {
    const response = await apiClient.put(`/materiales/${id}`, materialData);
    return response.data;
  },
  deleteMaterial: async (id) => {
    const response = await apiClient.delete(`/materiales/${id}`);
    return response.data;
  },
  getCategoriasMateriales: async () => {
    const response = await apiClient.get('/materiales/categorias');
    return response.data;
  }
};

// API de proveedores
const proveedoresApi = {
  getProveedores: async (categoria) => {
    const params = {};
    if (categoria) params.categoria = categoria;
    const response = await apiClient.get('/proveedores', { params });
    return response.data;
  },
  getProveedor: async (id) => {
    const response = await apiClient.get(`/proveedores/${id}`);
    return response.data;
  },
  createProveedor: async (proveedorData) => {
    const response = await apiClient.post('/proveedores', proveedorData);
    return response.data;
  },
  updateProveedor: async (id, proveedorData) => {
    const response = await apiClient.put(`/proveedores/${id}`, proveedorData);
    return response.data;
  },
  deleteProveedor: async (id) => {
    const response = await apiClient.delete(`/proveedores/${id}`);
    return response.data;
  },
  getContactos: async (proveedorId) => {
    const response = await apiClient.get(`/proveedores/${proveedorId}/contactos`);
    return response.data;
  },
  getContacto: async (id) => {
    const response = await apiClient.get(`/proveedores/contactos/${id}`);
    return response.data;
  },
  createContacto: async (contactoData) => {
    const response = await apiClient.post('/proveedores/contactos', contactoData);
    return response.data;
  },
  updateContacto: async (id, contactoData) => {
    const response = await apiClient.put(`/proveedores/contactos/${id}`, contactoData);
    return response.data;
  },
  deleteContacto: async (id) => {
    const response = await apiClient.delete(`/proveedores/contactos/${id}`);
    return response.data;
  }
};

// API de asignaciones de materiales
const asignacionesMaterialesApi = {
  getAsignacionesMateriales: async (tareaId, materialId, estado) => {
    const params = {};
    if (tareaId) params.tareaId = tareaId;
    if (materialId) params.materialId = materialId;
    if (estado) params.estado = estado;
    const response = await apiClient.get('/asignaciones-materiales', { params });
    return response.data;
  },
  getAsignacionMaterial: async (id) => {
    const response = await apiClient.get(`/asignaciones-materiales/${id}`);
    return response.data;
  },
  createAsignacionMaterial: async (asignacionData) => {
    const response = await apiClient.post('/asignaciones-materiales', asignacionData);
    return response.data;
  },
  updateAsignacionMaterial: async (id, asignacionData) => {
    const response = await apiClient.put(`/asignaciones-materiales/${id}`, asignacionData);
    return response.data;
  },
  deleteAsignacionMaterial: async (id) => {
    const response = await apiClient.delete(`/asignaciones-materiales/${id}`);
    return response.data;
  },
  getResumenMaterialesPorProyecto: async (proyectoId) => {
    const response = await apiClient.get(`/asignaciones-materiales/proyecto/${proyectoId}/resumen`);
    return response.data;
  }
};

// API de materiales-proveedores
const materialesProveedoresApi = {
  getMaterialesProveedores: async (materialId, proveedorId) => {
    const params = {};
    if (materialId) params.materialId = materialId;
    if (proveedorId) params.proveedorId = proveedorId;
    const response = await apiClient.get('/materiales-proveedores', { params });
    return response.data;
  },
  getMaterialProveedor: async (id) => {
    const response = await apiClient.get(`/materiales-proveedores/${id}`);
    return response.data;
  },
  createMaterialProveedor: async (data) => {
    const response = await apiClient.post('/materiales-proveedores', data);
    return response.data;
  },
  updateMaterialProveedor: async (id, data) => {
    const response = await apiClient.put(`/materiales-proveedores/${id}`, data);
    return response.data;
  },
  deleteMaterialProveedor: async (id) => {
    const response = await apiClient.delete(`/materiales-proveedores/${id}`);
    return response.data;
  },
  getComparativaProveedores: async (materialId) => {
    const response = await apiClient.get(`/materiales-proveedores/material/${materialId}/comparativa`);
    return response.data;
  }
};

/* --------------------- Nuevos Endpoints --------------------- */

// API de documentos
const documentosApi = {
  getDocumentos: async (filters = {}) => {
    const response = await apiClient.get('/documentos', { params: filters });
    return response.data;
  },
  getDocumento: async (id) => {
    const response = await apiClient.get(`/documentos/${id}`);
    return response.data;
  },
  createDocumento: async (documentoData) => {
    const response = await apiClient.post('/documentos', documentoData);
    return response.data;
  },
  uploadDocumento: async (formData) => {
    const response = await apiClient.post('/documentos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  downloadDocumento: async (id) => {
    const response = await apiClient.get(`/documentos/${id}/descargar`, {
      responseType: 'blob'
    });
    return response;
  },
  updateDocumento: async (id, documentoData) => {
    const response = await apiClient.put(`/documentos/${id}`, documentoData);
    return response.data;
  },
  deleteDocumento: async (id) => {
    const response = await apiClient.delete(`/documentos/${id}`);
    return response.data;
  }
};

// API de gremios
const gremiosApi = {
  getGremios: async () => {
    const response = await apiClient.get('/gremios');
    return response.data;
  },
  getGremio: async (id) => {
    const response = await apiClient.get(`/gremios/${id}`);
    return response.data;
  },
  createGremio: async (data) => {
    const response = await apiClient.post('/gremios', data);
    return response.data;
  },
  updateGremio: async (id, data) => {
    const response = await apiClient.put(`/gremios/${id}`, data);
    return response.data;
  },
  deleteGremio: async (id) => {
    const response = await apiClient.delete(`/gremios/${id}`);
    return response.data;
  }
};

// API de especialidades
const especialidadesApi = {
  getEspecialidades: async () => {
    const response = await apiClient.get('/especialidades');
    return response.data;
  },
  getEspecialidad: async (id) => {
    const response = await apiClient.get(`/especialidades/${id}`);
    return response.data;
  },
  createEspecialidad: async (data) => {
    const response = await apiClient.post('/especialidades', data);
    return response.data;
  },
  updateEspecialidad: async (id, data) => {
    const response = await apiClient.put(`/especialidades/${id}`, data);
    return response.data;
  },
  deleteEspecialidad: async (id) => {
    const response = await apiClient.delete(`/especialidades/${id}`);
    return response.data;
  }
};

// API de empleados
const empleadosApi = {
  getEmpleados: async (filters) => {
    const response = await apiClient.get('/empleados', { params: filters });
    return response.data;
  },
  getEmpleado: async (id) => {
    const response = await apiClient.get(`/empleados/${id}`);
    return response.data;
  },
  createEmpleado: async (data) => {
    const response = await apiClient.post('/empleados', data);
    return response.data;
  },
  updateEmpleado: async (id, data) => {
    const response = await apiClient.put(`/empleados/${id}`, data);
    return response.data;
  },
  deleteEmpleado: async (id) => {
    const response = await apiClient.delete(`/empleados/${id}`);
    return response.data;
  }
};

// API de asignaciones (extensión de los ya existentes)
// Asignación de empleados a tareas
const asignacionEmpleadoTareaApi = {
  getAsignaciones: async () => {
    const response = await apiClient.get('/asignacion-empleado-tarea');
    return response.data;
  },
  getAsignacion: async (id) => {
    const response = await apiClient.get(`/asignacion-empleado-tarea/${id}`);
    return response.data;
  },
  createAsignacion: async (data) => {
    const response = await apiClient.post('/asignacion-empleado-tarea', data);
    return response.data;
  },
  updateAsignacion: async (id, data) => {
    const response = await apiClient.put(`/asignacion-empleado-tarea/${id}`, data);
    return response.data;
  },
  deleteAsignacion: async (id) => {
    const response = await apiClient.delete(`/asignacion-empleado-tarea/${id}`);
    return response.data;
  }
};

// Asignación de especialidad a etapas
const asignacionEspecialidadEtapaApi = {
  getAsignaciones: async () => {
    const response = await apiClient.get('/asignacion-especialidad-etapa');
    return response.data;
  },
  getAsignacion: async (id) => {
    const response = await apiClient.get(`/asignacion-especialidad-etapa/${id}`);
    return response.data;
  },
  createAsignacion: async (data) => {
    const response = await apiClient.post('/asignacion-especialidad-etapa', data);
    return response.data;
  },
  updateAsignacion: async (id, data) => {
    const response = await apiClient.put(`/asignacion-especialidad-etapa/${id}`, data);
    return response.data;
  },
  deleteAsignacion: async (id) => {
    const response = await apiClient.delete(`/asignacion-especialidad-etapa/${id}`);
    return response.data;
  }
};

// Asignación de especialidad a tareas
const asignacionEspecialidadTareaApi = {
  getAsignaciones: async () => {
    const response = await apiClient.get('/asignacion-especialidad-tarea');
    return response.data;
  },
  getAsignacion: async (id) => {
    const response = await apiClient.get(`/asignacion-especialidad-tarea/${id}`);
    return response.data;
  },
  createAsignacion: async (data) => {
    const response = await apiClient.post('/asignacion-especialidad-tarea', data);
    return response.data;
  },
  updateAsignacion: async (id, data) => {
    const response = await apiClient.put(`/asignacion-especialidad-tarea/${id}`, data);
    return response.data;
  },
  deleteAsignacion: async (id) => {
    const response = await apiClient.delete(`/asignacion-especialidad-tarea/${id}`);
    return response.data;
  }
};

// API de gremio-especialidad (asociación de especialidades a gremios)
const gremioEspecialidadApi = {
  getAsociaciones: async () => {
    const response = await apiClient.get('/gremio-especialidad');
    return response.data;
  },
  getAsociacion: async (id) => {
    const response = await apiClient.get(`/gremio-especialidad/${id}`);
    return response.data;
  },
  createAsociacion: async (data) => {
    const response = await apiClient.post('/gremio-especialidad', data);
    return response.data;
  },
  deleteAsociacion: async (id) => {
    const response = await apiClient.delete(`/gremio-especialidad/${id}`);
    return response.data;
  }
};

// API de empleados-especialidades
const empleadosEspecialidadesApi = {
  findAll: async (params = {}) => {
    const response = await apiClient.get('/empleados-especialidades', { params });
    return response.data;
  },
  findById: async (id) => {
    const response = await apiClient.get(`/empleados-especialidades/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/empleados-especialidades', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/empleados-especialidades/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/empleados-especialidades/${id}`);
    return response.data;
  }
};

// API de reportes
const reportesApi = {
  getDashboardEjecutivo: async () => {
    const response = await apiClient.get('/reportes/dashboard-ejecutivo');
    return response.data;
  },
  getAnalisisMateriales: async () => {
    const response = await apiClient.get('/reportes/analisis-materiales');
    return response.data;
  },
  getAvanceProyecto: async (proyectoId) => {
    const response = await apiClient.get(`/reportes/avance-proyecto/${proyectoId}`);
    return response.data;
  },
  getRecursosHumanos: async () => {
    const response = await apiClient.get('/reportes/recursos-humanos');
    return response.data;
  }
};

/* --------------------- Exportación Final --------------------- */

export default {
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
  },
  // Módulos existentes
  proyectos: proyectosApi,
  etapas: etapasApi,
  tareas: tareasApi,
  users: usersApi,
  asignaciones: asignacionesApi,
  materiales: materialesApi,
  proveedores: proveedoresApi,
  asignacionesMateriales: asignacionesMaterialesApi,
  materialesProveedores: materialesProveedoresApi,
  // Nuevos módulos
  documentos: documentosApi,
  gremios: gremiosApi,
  especialidades: especialidadesApi,
  empleados: empleadosApi,
  empleadosEspecialidades: empleadosEspecialidadesApi, 
  asignacionEmpleadoTarea: asignacionEmpleadoTareaApi,
  asignacionEspecialidadEtapa: asignacionEspecialidadEtapaApi,
  asignacionEspecialidadTarea: asignacionEspecialidadTareaApi,
  gremioEspecialidad: gremioEspecialidadApi,
  reportes: reportesApi
};