import axios from 'axios';
const API = axios.create({ baseURL: 'http://127.0.0.1:8000' });
export const login = (data) => API.post('/auth/login', data);
export const getCurrentUser = (token) => API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
export const createTrip = (data, token) => API.post('/trips', data, { headers: { Authorization: `Bearer ${token}` } });
export const findTrips = () => API.get('/trips');
export const getTripById = (id) => API.get(`/trips/${id}`);
export default API;