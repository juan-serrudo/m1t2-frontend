import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// URL base para todas las peticiones (modifica esta URL según tu API)
import { GATEWAY_API_URL } from '../common/environment';

// Hook para capturar errores de red(el servicio se cae):
import { TOKEN_KEY } from '../common/constant/localstorage.constant';

// Crear una instancia de Axios
const axiosClient: AxiosInstance = axios.create({
    baseURL: GATEWAY_API_URL,
    timeout: 5000, // Tiempo máximo de espera (opcional)
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// Interceptor de solicitud
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // const token = localStorage.getItem(TOKEN_KEY); // o donde guardes tu token
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXN1YXJpbyIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzQzMTAzNjYzLCJleHAiOjE3NDMxMTgwNjN9.jw0AI6KLFWS_qAnDYkDlNqqKIt5PzAdYXL4EPqXEmJI"
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error: AxiosError) => {
        // Manejo de errores en la solicitud
        console.error('Error en la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Handle network errors
        if (error.message === 'Network Error') {
            console.error('Network Error: Please try again');
            // You might want to use a global state management solution like Redux, Context API, or a custom event system
            // to handle network errors across your application
            window.dispatchEvent(new CustomEvent('network-error', { detail: true }));
        }

        // Handle response errors
        if (error.response?.status === 401) {
            console.error('Unauthorized, redirecting to login...');
            // Here you can redirect the user to login if necessary
            // For example: window.location.href = '/login';
        } else if (error.response?.status === 500) {
            console.error('Server Error');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
