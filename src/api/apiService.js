import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;


const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers:{
        'Content-Type' : 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('RCI6IkpXVCJ9');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?. status === 401) {
            localStorage.clear();
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
)

const makeRequest = async (method, endpoint, data = null, config = {}) => {
    try {
        const response = await apiClient({ method, url: endpoint, data, ...config });
        return {
            success: true,
            data: response.data,
            status: response.status,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message || 'Unknown error',
            status: error.response?.status || 500,
        };
    }
};



export const apiService = {
    get : (endpoint, config = {}) => makeRequest('GET', endpoint, null, config),
    post: (endpoint, data, config = {}) => makeRequest('POST', endpoint, data, config),
    put: (endpoint, data, config = {}) => makeRequest('PUT', endpoint, data, config),
    delete: (endpoint, config = {}) => makeRequest('DELETE', endpoint, null, config),
    patch: (endpoint, data, config = {}) => makeRequest('PATCH', endpoint, data, config),
}
