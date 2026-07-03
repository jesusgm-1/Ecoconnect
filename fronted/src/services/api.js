import axios from 'axios';

// The base URL for the Gateway
const GATEWAY_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to the authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (region, credentials) => {
    const response = await api.post(`/auth/${region}/login`, credentials);
    return response.data;
  },
  register: async (region, userData) => {
    const response = await api.post(`/auth/${region}/registro`, userData);
    return response.data;
  }
};

export const excedentesAPI = {
  crear: async (region, data) => {
    const response = await api.post(`/excedentes/${region}`, data);
    return response.data;
  },
  listar: async (region) => {
    const response = await api.get(`/excedentes/${region}`);
    return response.data;
  },
  porEmpresa: async (region, empresaId) => {
    const response = await api.get(`/excedentes/${region}/empresa/${empresaId}`);
    return response.data;
  },
  reclamar: async (region, excedenteId, ongId) => {
    // According to your gateway router: @router.put("/{region}/{excedente_id}/reclamar")
    const response = await api.put(`/excedentes/${region}/${excedenteId}/reclamar?ong_id=${ongId}`);
    return response.data;
  },
  confirmar: async (region, excedenteId, empresaId) => {
    const response = await api.put(`/excedentes/${region}/${excedenteId}/confirmar?empresa_id=${empresaId}`);
    return response.data;
  }
};

// Add other services as necessary (empresas, ongs)
export const empresasAPI = {
   listar: async (region) => {
       const response = await api.get(`/empresas/${region}`);
       return response.data;
   }
}

export const ongsAPI = {
   listar: async (region) => {
       const response = await api.get(`/ongs/${region}`);
       return response.data;
   }
}

export default api;
