import axios from 'axios'

const tesloApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

});

// TODO: Interceptores
// los interceptores ayudan a modificar la request ó la response

tesloApi.interceptors.request.use((config) => {
    
    // cada vez que se hace una request hay que verificar el token: 
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
})

export { tesloApi };