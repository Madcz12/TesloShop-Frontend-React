import { tesloApi } from "@/api/tesloApi";
import type { AuthResponse } from "../interfaces/auth.response";

export const checkAuthAction = async (): Promise<AuthResponse> => {

    // obtenemos el token actual que se encuentra en el localstorage: 
    const token = localStorage.getItem('token');

    if (!token) throw new Error('No token found');

    // utilizamos un try-catch en caso de que el token haya expirado o haya sucecido algo en el login
    try {
        // se prepara la respuest ade la API: 
        const { data } = await tesloApi.get<AuthResponse>('/auth/check-status');

        // guardamos el token generado del endpoint check-status
        localStorage.setItem('token', data.token);

        return data;

    } catch (error) {
        console.log(error);
        // si se lanza alguna exepción quiere decir que existe un token en el LS
        localStorage.removeItem('token');
        throw new Error('Token expired or not valid');
    }

}