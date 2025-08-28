import { useAuthStore } from "@/auth/store/auth.store"
import type { PropsWithChildren } from "react"
import { Navigate } from "react-router";

// componente padre que verifica la ruta autenticada
export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();
    if (authStatus === 'checking') return null
    if (authStatus === 'not-authenticated') return <Navigate to="/auth/login" />;
    return children
};

// componente padre que verifica la ruta no autenticada
export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === "checking") return null;
  if (authStatus === "authenticated") return <Navigate to="/" />;

  return children;
};
// componente padre que verifica la ruta de administrador
export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, isAdmin } = useAuthStore();
  if (authStatus === "checking") return null;
  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;
  if(!isAdmin()) return <Navigate to='/'/>

  return children;
};