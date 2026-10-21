import axios from 'axios';

const API = axios.create({
  baseURL: '/api/usuarios'
});

export const getUsers = () => API.get('');
export const createUser = (userData) => API.post('', userData);
export const updateUser = (id, userData) => API.put(`/${id}`, userData);
export const deleteUser = (id) => API.delete(`/${id}`);
