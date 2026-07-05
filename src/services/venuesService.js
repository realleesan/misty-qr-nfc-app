import api from './api';

export const venuesService = {
  async list() {
    const response = await api.get('/api/qr-nfc/venues');
    return response.data;
  },

  async get(id) {
    const response = await api.get(`/api/qr-nfc/venues/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/api/qr-nfc/venues', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/api/qr-nfc/venues/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/qr-nfc/venues/${id}`);
    return response.data;
  },
};
