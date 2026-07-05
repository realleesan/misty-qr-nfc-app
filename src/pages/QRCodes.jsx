import { useState, useEffect } from 'react';
import { Plus, Download, Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import { qrService } from '../services/qrService';

export default function QRCodes() {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQR, setEditingQR] = useState(null);
  const [formData, setFormData] = useState({
    venue_id: '',
    name: '',
    description: '',
    redirect_url: ''
  });

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      const data = await qrService.list();
      setQRCodes(data.qr_codes || []);
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingQR(null);
    setFormData({ venue_id: '', name: '', description: '', redirect_url: '' });
    setShowModal(true);
  };

  const handleEdit = (qr) => {
    setEditingQR(qr);
    setFormData({
      venue_id: qr.venue_id,
      name: qr.name,
      description: qr.description || '',
      redirect_url: qr.redirect_url
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    try {
      await qrService.delete(id);
      loadQRCodes();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      alert('Failed to delete QR code');
    }
  };

  const handleDownload = (qr) => {
    if (qr.qr_image_url) {
      const link = document.createElement('a');
      link.href = qr.qr_image_url;
      link.download = `qr-${qr.code}.png`;
      link.click();
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('QR code copied to clipboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQR) {
        await qrService.update(editingQR.id, formData);
      } else {
        await qrService.create(formData);
      }
      setShowModal(false);
      loadQRCodes();
    } catch (error) {
      console.error('Failed to save QR code:', error);
      alert('Failed to save QR code');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">QR Codes</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create QR Code
        </button>
      </div>

      {qrCodes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">No QR codes created yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{qr.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${qr.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {qr.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {qr.qr_image_url && (
                <div className="mb-4 flex justify-center">
                  <img src={qr.qr_image_url} alt="QR Code" className="w-32 h-32" />
                </div>
              )}
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Code:</strong> {qr.code}</p>
                <p><strong>Scans:</strong> {qr.scan_count}</p>
                {qr.description && <p><strong>Description:</strong> {qr.description}</p>}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopyCode(qr.code)}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => handleDownload(qr)}
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
                <a
                  href={qr.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Test
                </a>
                <button
                  onClick={() => handleEdit(qr)}
                  className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(qr.id)}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingQR ? 'Edit QR Code' : 'Create QR Code'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue ID</label>
                <input
                  type="text"
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                <input
                  type="url"
                  value={formData.redirect_url}
                  onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingQR ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
