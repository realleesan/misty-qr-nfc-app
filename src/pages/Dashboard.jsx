import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const data = await analyticsService.getOverview();
      setOverview(data.overview);
    } catch (error) {
      console.error('Failed to load overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total QR Codes</h3>
          <p className="text-3xl font-bold text-gray-800">{overview?.total_qr_codes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Scans</h3>
          <p className="text-3xl font-bold text-gray-800">{overview?.total_scans || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active QR Codes</h3>
          <p className="text-3xl font-bold text-gray-800">{overview?.active_qr_codes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Reviews</h3>
          <p className="text-3xl font-bold text-gray-800">{overview?.total_reviews || 0}</p>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/qr-codes" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <h3 className="font-semibold text-blue-800">Create QR Code</h3>
            <p className="text-sm text-blue-600">Generate a new QR code for your venue</p>
          </a>
          <a href="/analytics" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <h3 className="font-semibold text-green-800">View Analytics</h3>
            <p className="text-sm text-green-600">See detailed scan and review data</p>
          </a>
          <a href="/settings" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <h3 className="font-semibold text-purple-800">Manage Settings</h3>
            <p className="text-sm text-purple-600">Update your profile and venue info</p>
          </a>
        </div>
      </div>
    </div>
  )
}
