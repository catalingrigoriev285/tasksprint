import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../../../components/layout/UserLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { TASK_ENDPOINTS } from '../../../utils/apiPaths';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(TASK_ENDPOINTS.GET_BY_ID(id));
      setTask(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistToggle = async (index) => {
    try {
      setUpdating(true);
      const updatedChecklist = [...task.todoCheckList];
      updatedChecklist[index].completed = !updatedChecklist[index].completed;

      const response = await axiosInstance.put(
        TASK_ENDPOINTS.UPDATE_CHECKLIST(id),
        { todoCheckList: updatedChecklist }
      );
      
      setTask(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update checklist');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </UserLayout>
    );
  }

  if (error || !task) {
    return (
      <UserLayout>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/user/my-tasks')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to tasks
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Task not found'}
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user/my-tasks')}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to tasks
        </button>

        {/* Task Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-normal text-gray-900">{task.title}</h1>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-700 mb-4 leading-relaxed">{task.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Due Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(task.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Created By</p>
              <p className="text-sm font-medium text-gray-900">
                {task.createdBy?.username || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{task.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        {task.todoCheckList && task.todoCheckList.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Checklist</h2>
            <div className="space-y-3">
              {task.todoCheckList.map((item, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(index)}
                    disabled={updating}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={`text-sm flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attachments</h2>
            <div className="space-y-2">
              {task.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-blue-600 hover:underline">
                    {attachment.split('/').pop()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default ViewTaskDetails;
