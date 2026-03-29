// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile/update`,
  UPLOAD_PROFILE_IMAGE: `${API_BASE_URL}/auth/profile/image`,
};

// User Endpoints
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  CREATE: `${API_BASE_URL}/users`,
  UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
  DELETE: (id) => `${API_BASE_URL}/users/${id}`,
};

// Task Endpoints
export const TASK_ENDPOINTS = {
  // Admin endpoints
  DASHBOARD_DATA: `${API_BASE_URL}/tasks/dashboard-data`,
  USER_DASHBOARD_DATA: `${API_BASE_URL}/tasks/user-dashboard-data`,
  GET_ALL: `${API_BASE_URL}/tasks`,
  CREATE: `${API_BASE_URL}/tasks`,
  UPDATE: (id) => `${API_BASE_URL}/tasks/${id}`,
  DELETE: (id) => `${API_BASE_URL}/tasks/${id}`,
  
  // User endpoints
  MY_TASKS: `${API_BASE_URL}/tasks/my-tasks`,
  MY_DASHBOARD: `${API_BASE_URL}/tasks/my-dashboard`,
  GET_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}/tasks/${id}/status`,
  UPDATE_CHECKLIST: (id) => `${API_BASE_URL}/tasks/${id}/todos`,
};

// Report Endpoints
export const REPORT_ENDPOINTS = {
  EXPORT_TASKS: `${API_BASE_URL}/reports/export/reports`,
  EXPORT_USERS: `${API_BASE_URL}/reports/export/users`,
};

export default {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  TASK_ENDPOINTS,
  REPORT_ENDPOINTS,
};
