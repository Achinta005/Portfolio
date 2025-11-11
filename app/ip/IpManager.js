'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';

export default function IPManagement() {
  const [ips, setIps] = useState([]);
  const [newIp, setNewIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL;

  useEffect(() => {
    fetchIPs();
  }, []);

  const fetchIPs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/ips`);
      if (!response.ok) throw new Error('Failed to fetch IPs');
      const data = await response.json();
      setIps(data.ips || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addIP = async (e) => {
    if (e) e.preventDefault();
    if (!newIp.trim()) return;

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_URL}/ips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipaddress: newIp.trim() })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add IP');
      }
      
      setSuccess('IP address added successfully!');
      setNewIp('');
      fetchIPs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteIP = async (id) => {
    if (!confirm('Are you sure you want to delete this IP address?')) return;

    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_URL}/ips/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete IP');
      }
      
      setSuccess('IP address deleted successfully!');
      fetchIPs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">IP Address Management</h1>
            <p className="text-blue-100 mt-2">Manage authorized IP addresses</p>
          </div>

          <div className="p-8 border-b border-slate-200 bg-slate-50">
            <div className="flex gap-4">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                onKeyPress={(e) => e.key === 'Enter' && addIP(e)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addIP}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Add IP
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : ips.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">No IP addresses found</p>
                <p className="text-sm mt-2">Add your first IP address to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">IP Address</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Created At</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ips.map((ip, index) => (
                      <tr 
                        key={ip.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="py-4 px-4 text-slate-600">{ip.id}</td>
                        <td className="py-4 px-4">
                          <span className="font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                            {ip.ipaddress}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {new Date(ip.created_at).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => deleteIP(ip.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Total IP Addresses: <span className="font-semibold text-slate-800">{ips.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}