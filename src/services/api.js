// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'http://localhost:4000/api';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  const result = await response.json();
  return result.data;
};

export const adminService = {
  getStats: async () => {
    // For now, these might need to be calculated or fetched from multiple endpoints
    // or we can add a specific stats endpoint in the backend.
    // I'll return mock for stats if not available, or try to fetch some real data.
    try {
      const buses = await adminService.getBuses();
      const routes = await adminService.getRoutes();
      const reports = await adminService.getRecentReports();
      const users = await adminService.getUsers();

      return {
        totalBuses: buses.length,
        activeRoutes: routes.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        totalStudents: users.length,
        busesChange: 0,
        routesChange: 0,
        reportsChange: 0,
        studentsChange: 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalBuses: 0,
        activeRoutes: 0,
        pendingReports: 0,
        totalStudents: 0,
        busesChange: 0,
        routesChange: 0,
        reportsChange: 0,
        studentsChange: 0
      };
    }
  },

  getRecentReports: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.reports || data;
  },

  getSystemStatus: async () => {
    // This could be a health check or a hardcoded list for now
    return [
      { name: "Backend API", status: "online", active: true },
      { name: "Live Tracking", status: "active", active: true },
      { name: "Database Backup", status: "online", active: true },
      { name: "Notification Service", status: "online", active: true },
    ];
  },

  getBuses: async () => {
    const response = await fetch(`${API_BASE_URL}/buses/get-all-buses`, {
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  getRoutes: async () => {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.routes || data;
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/get-all-users`, {
      headers: getHeaders()
    });
    return await handleResponse(response);
  },

  getLostFoundItems: async () => {
    const response = await fetch(`${API_BASE_URL}/lost-found`, {
      headers: getHeaders()
    });
    const data = await handleResponse(response);
    return data.items || data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(response);
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await handleResponse(response);
  },

  updateReportStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return await handleResponse(response);
  }
};
