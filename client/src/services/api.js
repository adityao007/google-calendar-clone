import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

/**
 * Event Service
 * Handles all API calls related to calendar events
 */
export const eventService = {
  /**
   * Get all events within a date range
   * @param {Date} startDate - Start of date range
   * @param {Date} endDate - End of date range
   * @returns {Promise<Array>} Array of events
   */
  getEvents: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const response = await api.get('/events', { params });
    return response.data;
  },

  /**
   * Get a single event by ID
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Event object
   */
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default api;

