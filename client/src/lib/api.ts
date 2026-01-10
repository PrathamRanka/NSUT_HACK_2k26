import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000', // API Gateway URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
