import { create } from 'zustand';
import type { User } from '@/interfaces/user.interface';
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { RegisterAction } from '../actions/register.action';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'; 

type AuthState = {
    // Properties
    user: User | null, 
    token: string | null,
    authStatus: AuthStatus;
    // Getters
    isAdmin: () => boolean;

    // Actions
    login: (email: string, password: string) => Promise<boolean>; 
    register: (email: string, password: string, fullName: string) => Promise<boolean>; 
    logout: () => void;
    checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    // Implementación del store
    user: null,
    token: null,
    authStatus: 'checking', // estado inicial

    // getters
    isAdmin: () => {
        // con el get obtenemos todas las funciones que se encuentran dentro del store (la estructura AuthState)
        const roles = get().user?.roles || [];
        // verificamos que dentro del arreglo 'roles' exista el rol admin 
        return roles.includes('admin'); // regresa true o false
    },

    // Actions
    login: async (email: string, password: string) => {
        console.log({email, password});

        try {
            const data = await loginAction(email, password);
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, authStatus: 'authenticated' });
            return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            localStorage.removeItem('token');
            set({user: null, token: null, authStatus: 'not-authenticated'})
            return false;
        }
    },
    register: async (email: string, password: string, fullName: string) => {
        console.log({email, password, fullName});

        try {
            const data = await RegisterAction(email, password, fullName);
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, authStatus: 'authenticated' });
            return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            localStorage.removeItem('token');
            set({user: null, token: null, authStatus: 'not-authenticated'})
            return false;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, authStatus: 'not-authenticated' });
    },
    checkAuthStatus: async () => {
        
        try {
            
            const { user, token } = await checkAuthAction();
            // establecemos el usuario en el set del Store: 
            set({
                user: user,
                token: token,
                authStatus: 'authenticated'
            });
            return true;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set({
                user: undefined,
                token: undefined,
                authStatus: 'not-authenticated'
            });
            return false;
        }

    },
    
}));