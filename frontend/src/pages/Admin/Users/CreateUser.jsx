import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { USER_ENDPOINTS } from '../../../utils/apiPaths';

const CreateUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editId) {
      fetchUser(editId);
    }
  }, [editId]);

  const fetchUser = async (id) => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.GET_BY_ID(id));
      const user = response.data;
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Don't populate password for security
        role: user.role
      });
    } catch (err) {
      setError('Failed to load user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate password for new users
      if (!editId && formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const payload = { ...formData };
      // Don't send password if it's empty during edit
      if (editId && !formData.password) {
        delete payload.password;
      }

      if (editId) {
        await axiosInstance.put(USER_ENDPOINTS.UPDATE(editId), payload);
      } else {
        await axiosInstance.post(USER_ENDPOINTS.CREATE, payload);
      }
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/admin/users')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to users
          </button>
          <h1 className="text-2xl font-normal text-gray-900 mb-1">
            {editId ? 'Edit User' : 'Create New User'}
          </h1>
          <p className="text-sm text-gray-600">
            {editId ? 'Update user details' : 'Fill in the details to create a new user'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {editId && <span className="text-gray-500 font-normal">(leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editId}
                placeholder={editId ? "Leave blank to keep current password" : "Enter password"}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              {!editId && (
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Admins have full access to manage tasks and users
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editId ? 'Update User' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateUser;
