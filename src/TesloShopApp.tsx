import type { PropsWithChildren } from "react";
import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from 'sonner';
import { CustomFullScreenLoading } from "./components/custom/CustomFullScreenLoading";
import { useAuthStore } from "./auth/store/auth.store";


const queryClient = new QueryClient();

// creamos un customProvider para vincular el return que contiene el queryClient
const CheckAuthProvider = ({ children }: PropsWithChildren) => {

  // llamamos al store: 
  const { checkAuthStatus } = useAuthStore();

  // al realizar una petición HTTP se debe modificar el store de Zustand para actualizar el usuario:
  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthStatus, // duración del token que se devuelve aqui junto con el user = 2 horas
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <CustomFullScreenLoading/>

  return children;
}

export const TesloShopApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CheckAuthProvider>
      <RouterProvider router={appRouter}/>

      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
