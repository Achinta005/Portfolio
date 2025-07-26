"use client";

import { useState } from 'react';
import { getAuthToken } from '../lib/auth';

const TextEditor = ({ onDocumentSaved }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = getAuthToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      // --- FIX: Corrected the API endpoint URL to match server.js ---
      const response = await fetch(`${apiUrl}/api/auth/documents`, { 
      // -------------------------------------------------------------
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save document.');
      }

      setSuccess('Document saved successfully!');
      setTitle('');
      setContent('');
      if (onDocumentSaved) {
        onDocumentSaved(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Your JSX for the form remains the same
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-black mb-4 text-center">Your Personal NotePad</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-purple-800 border rounded-lg" required />
        </div>
        <div className="mb-6">
          <label className="block text-black text-sm font-bold mb-2">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full text-green-600 px-3 py-2 border rounded-lg" rows="6" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">
          {loading ? 'Saving...' : 'Save Document'}
        </button>
      </form>
    </div>
  );
};

export default TextEditor;
