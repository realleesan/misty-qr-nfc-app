import api from './api';

export const reviewsService = {
  async submit(data) {
    const response = await api.post('/api/qr-nfc/reviews/submit', data);
    return response.data;
  },

  async list(params = {}) {
    const response = await api.get('/api/qr-nfc/reviews', { params });
    return response.data;
  },

  async stats() {
    const response = await api.get('/api/qr-nfc/reviews/stats');
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/api/qr-nfc/reviews/${id}`, data);
    return response.data;
  },

  async ownerList(params = {}) {
    const response = await api.get('/api/qr-nfc/owners/reviews', { params });
    return response.data;
  },

  async ownerStats() {
    const response = await api.get('/api/qr-nfc/reviews/stats');
    return response.data;
  }
};
