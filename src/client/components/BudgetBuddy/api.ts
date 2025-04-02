import axios from 'axios';

const api = axios.create({
  // API route base URL
  baseURL: '/api/budget',
  // to handle authentication sessions
  withCredentials: true,
});
// budget API axios setup
//create a dedicated axios instance
//can reuse to interact with budget api

export default api;




