a// API Configuration
const API_CONFIG = {
    baseURL: 'https://complaint-api-backend.onrender.com/api',
    endpoints: {
        register: '/users/register',
        login: '/users/login',
        users: '/users',
        complaints: '/complaints',
        myComplaints: '/complaints/my-complaints'
    },
    timeout: 10000
};

// Create Axios instance
const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login.html';
        }
        return Promise.reject(error);
    }
);