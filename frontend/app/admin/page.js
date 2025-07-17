'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall, isAuthenticated } from '../lib/auth';
import Project from './Project';
import ContactResponse from './ContactResponse';

const AdminPage = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        // Use environment variable or fallback to localhost
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await apiCall(`${apiUrl}/api/admin/dashboard`);
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setError('Failed to load admin dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('Authentication failed');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // If projects view is active, render the Projects component
  if (activeView === 'projects') {
    return (
      <div>
        <button 
          onClick={() => setActiveView('dashboard')}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  // If messages view is active, render the ContactResponse component
  if (activeView === 'messages') {
    return (
      <div>
        <button 
          onClick={() => setActiveView('dashboard')}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your website content and settings</p>
        </div>

        {/* Welcome Card */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-user-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome back, {user}!</h2>
                <p className="text-gray-600">You have successfully accessed the admin panel.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-folder-line text-blue-600 text-lg"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage your portfolio projects</p>
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setActiveView('projects')}
            >
              Manage Projects →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-message-line text-green-600 text-lg"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            </div>
            <p className="text-gray-600 mb-4">View contact form submissions</p>
            <button 
              className="text-green-600 hover:text-green-800 font-medium"
              onClick={() => setActiveView('messages')}
            >
              View Messages →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-settings-line text-purple-600 text-lg"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure site settings</p>
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              Open Settings →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-file-add-line text-blue-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New project added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-mail-line text-green-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New contact message</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <i className="ri-edit-line text-yellow-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Profile updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;