import { useState, useEffect } from 'react';
import { Star, MessageSquare, Filter, RefreshCw } from 'lucide-react';
import { reviewsService } from '../services/reviewsService';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [statusFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await reviewsService.ownerList(params);
      setReviews(data.reviews || []);
      setError('');
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await reviewsService.ownerStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await reviewsService.update(id, { is_approved: true });
      loadReviews();
      loadStats();
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await reviewsService.update(id, { is_approved: false });
      loadReviews();
      loadStats();
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading && !stats) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Đánh giá & Phản hồi</h1>
        <button
          onClick={loadReviews}
          className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Tổng đánh giá</p>
            <p className="text-2xl font-bold">{stats.total_reviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Đánh giá TB</p>
            <p className="text-2xl font-bold">{stats.average_rating || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Phản hồi tích cực (≥4)</p>
            <p className="text-2xl font-bold text-green-600">{stats.positive_reviews}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Phản hồi nội bộ (<4)</p>
            <p className="text-2xl font-bold text-red-600">{stats.negative_reviews}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Chưa có đánh giá nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs rounded ${getRatingColor(review.rating)}`}>
                      {review.rating} sao
                    </span>
                    <span className="text-sm text-gray-500">
                      {review.venue_name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.is_approved ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </div>
              </div>

              {review.comment && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  {review.customer_name && <span>Khách: {review.customer_name}</span>}
                  {review.customer_email && <span className="ml-2">{review.customer_email}</span>}
                </div>
                <div>{new Date(review.created_at).toLocaleString('vi-VN')}</div>
              </div>

              {!review.is_approved && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
