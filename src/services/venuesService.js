import api from './api';

export const venuesService = {
  async list() {
    try {
      const response = await api.get('/api/qr-nfc/venues');
      return response.data;
    } catch (error) {
      console.error('venuesService.list failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
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
