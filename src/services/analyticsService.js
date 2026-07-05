import api from './api';

export const analyticsService = {
  async getOverview(venueId) {
    const params = venueId ? { venue_id: venueId } : {};
    const response = await api.get('/api/qr-nfc/analytics/overview', { params });
    return response.data;
  },

  async getScans(venueId, startDate, endDate) {
    const params = {};
    if (venueId) params.venue_id = venueId;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await api.get('/api/qr-nfc/analytics/scans', { params });
    return response.data;
  },

  async getReviews(venueId) {
    const params = venueId ? { venue_id: venueId } : {};
    const response = await api.get('/api/qr-nfc/analytics/reviews', { params });
    return response.data;
  },
};
