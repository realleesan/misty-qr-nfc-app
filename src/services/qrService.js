import api from './api';

export const qrService = {
  async list(venueId) {
    const params = venueId ? { venue_id: venueId } : {};
    const response = await api.get('/api/qr-nfc/qr', { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/api/qr-nfc/qr', data);
    return response.data;
  },

  async get(id) {
    const response = await api.get(`/api/qr-nfc/qr/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/api/qr-nfc/qr/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/api/qr-nfc/qr/${id}`);
    return response.data;
  },
};
