import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/api/qr-nfc/auth/register', data);
    return response.data;
  },

  async login(data) {
    const response = await api.post('/api/qr-nfc/auth/login', data);
    return response.data;
  },

  async refresh() {
    const response = await api.post('/api/qr-nfc/auth/refresh');
    return response.data;
  },

  async me() {
    const response = await api.get('/api/qr-nfc/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
};
