import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByIdAction } from "../actions/get-product-by-id.action"
import type { Product } from "@/interfaces/product.interface";
import { createUpdateProductAction } from "../actions/create-update-product.action";

export const useProduct = (id: string) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getProductByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  //TODO: manejar la mutación

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {
      console.log('Todo Salió bien', product);
      // invalidar cache
      queryClient.invalidateQueries({ queryKey: ['Products'] });
      queryClient.invalidateQueries({ queryKey: ['Product', { id: product.id }] });
      // Actualizar querydata para ahorarr hacer una petición HTTP adicional para ver la nueva data 
      queryClient.setQueryData(['products', { id: product.id }], product);
    },
  });

  // al usar el método mutate de la propiedad mutation internamente infiere las props (en este caso un Partial<Product>)


  //TODO: por eliminar
  // const handleSubmitForm = async (productFake: Partial<Product>) => {
  //   console.log({ productFake });
  // };

  // regresamos todo el query
  return {
    ...query,
    mutation,
  };
}
