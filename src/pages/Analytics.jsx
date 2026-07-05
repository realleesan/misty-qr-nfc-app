import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/analyticsService';

export default function Analytics() {
  const [scanData, setScanData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      const [scans, reviews] = await Promise.all([
        analyticsService.getScans(null, dateRange.start, dateRange.end),
        analyticsService.getReviews()
      ]);
      
      setScanData(scans.scans || []);
      setReviewData(reviews.ratings || []);
      setAverageRating(reviews.average_rating || 0);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
      
      {/* Date filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Scans</h3>
          <p className="text-3xl font-bold text-gray-800">
            {scanData.reduce((sum, item) => sum + item.scans, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Unique Scans</h3>
          <p className="text-3xl font-bold text-gray-800">
            {scanData.reduce((sum, item) => sum + item.unique_scans, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
        </div>
      </div>

      {/* Scan chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scanData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="scans" stroke="#3b82f6" name="Total Scans" />
            <Line type="monotone" dataKey="unique_scans" stroke="#10b981" name="Unique Scans" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Review distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
