import axios from 'axios';

// Vite env vars live on import.meta.env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          { refresh_token: refreshToken }
        );
        localStorage.setItem('token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.data.access_token}`;
        original.headers['Authorization'] = `Bearer ${data.data.access_token}`;
        return api(original);
      } catch (e) {
        localStorage.clear();
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
