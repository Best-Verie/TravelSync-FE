import axios from 'axios';

// Use environment variables for API URL or default to localhost in development
const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set JWT token in the headers
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor to include the token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  validateToken: async (token: string) => {
    setAuthToken(token);
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  create: async (data) => {
     const response = await api.post('/users', data);
     return response.data;
  },
  update: async (id: string, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  updatePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const response = await api.patch(`/users/${id}/password`, {
      currentPassword,
      password: newPassword
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  // User profile methods
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};

export const statsApi = {
  getAppStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};

export const experiencesApi = {
  getAll: async (filters = {}) => {
    console.log('Fetching experiences with filters:', filters);
    const response = await api.get('/experiences', { 
      params: filters 
    });
    console.log('Experience response:', response.data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/experiences', data);
    return response.data;
  },
  update: async (id: string, data) => {
    const response = await api.patch(`/experiences/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data;
  }
}

export const bookingsApi = {
  getAll: async (filters = {}) => {
    console.log('Fetching bookings with filters:', filters);
    const response = await api.get('/bookings', { 
      params: filters 
    });
    console.log('Bookings response:', response.data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (data) => {
    console.log('Creating booking with data:', data);
    try {
      const response = await api.post('/bookings', data);
      console.log('Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  update: async (id: string, data) => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  getUserBookings: async (userId: string, filters = {}) => {
    console.log('Getting bookings for user:', userId);
    const response = await api.get('/bookings', {
      params: { 
        userId,
        ...filters 
      }
    });
    return response.data;
  },
  getProviderBookings: async (hostId: string, filters = {}) => {
    console.log('Getting bookings for provider:', hostId);
    const response = await api.get(`/bookings/provider/${hostId}`);
    return response.data;
  },
  getBookingsByExperience: async (experienceId: string, filters = {}) => {
    console.log('Getting bookings for experience:', experienceId);
    const response = await api.get('/bookings', {
      params: {
        experienceId,
        ...filters
      }
    });
    return response.data;
  },
  getBookingsByDate: async (date: string, filters = {}) => {
    console.log('Getting bookings for date:', date);
    const response = await api.get('/bookings', {
      params: {
        date,
        ...filters
      }
    });
    return response.data;
  }
};

export const contactApi = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/contact/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

export const coursesApi = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/courses', data);
    return response.data;
  },
  update: async (id: string, data) => {
    const response = await api.patch(`/courses/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};

export const enrollmentsApi = {
  getAll: async (filters = {}) => {
    console.log('Fetching enrollments with filters:', filters);
    const response = await api.get('/enrollments', {
      params: filters
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/enrollments', data);
    return response.data;
  },
  update: async (id: string, data) => {
    const response = await api.patch(`/enrollments/${id}`, data);
    return response.data;
  },
  complete: async (id: string) => {
    const response = await api.patch(`/enrollments/${id}/complete`, {});
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
  getUserEnrollments: async (userId: string) => {
    const response = await api.get('/enrollments', {
      params: { userId }
    });
    return response.data;
  }
};
