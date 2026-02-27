import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Foolproof check: if deployed to Vercel but the user forgot to add `/api` to the backend URL
if (baseURL && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
    baseURL = baseURL.replace(/\/$/, '') + '/api';
}

const api = axios.create({
    baseURL,
    timeout: 10000, // 10 seconds timeout
});

export default api;
