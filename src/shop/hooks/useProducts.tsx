import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router";


export const useProducts = () => {
    
    //TODO: viene lógica
    const { gender } = useParams();
    const [searchParams] = useSearchParams();

    const query = searchParams.get('query') || undefined;
     
    const limit = searchParams.get('limit') || 9;
    const page = searchParams.get('page') || 1;
    const sizes = searchParams.get('sizes') || undefined;
    // al indice se le resta 1 para indicar que si por ejemplo se está en la página 1 el indice es 0 y se multiplica por el limite
    // ejemplos: 2-1 = 1 * 9 = 9
    // ejemplos: 3-1 = 2 * 9 = 18
    // ejemplos: 4-1 = 3 * 9 = 27 
    // ejemplos: 5-1 = 4 * 9 = 36
    // lo que hace que el valor del limite cuantas páginas se van a crear cada vez que se avance una página 
    const offset = (Number(page) - 1) * Number(limit);

    const price = searchParams.get('price') || 'any';
    let minPrice = undefined; 
    let maxPrice = undefined;

    switch (price) {
      case "any":
        break;
      case "0-50":
        minPrice = 0;
        maxPrice = 50;
        break;
      case "50-100":
        minPrice = 50;
        maxPrice = 100;
        break;
      case "100-200":
        minPrice = 100;
        maxPrice = 200;
        break;
      case "200+":
        minPrice = 200;
        maxPrice = undefined;
        break;
    }

    return useQuery({
        queryKey: ['products', { offset, limit, sizes, gender, minPrice, maxPrice, query }],
        // cuando la función tiene argumentos se escribe el () para indicar que vienen parámetros
        queryFn: () => getProductsAction({
            limit: isNaN(+limit) ? 9 : limit,
            offset: isNaN(offset) ? 0 : offset,
            gender,
            sizes,
            minPrice,
            maxPrice,
            query
        }),
        staleTime: 1000 * 60 * 5,
    });

};
