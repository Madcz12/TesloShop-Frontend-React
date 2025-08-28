import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";

export const getProductByIdAction = async (id: string): Promise<Product> => {

    if (!id) throw new Error('Id is required');

    if (id === 'new') {
        // con este return se accede a las propiedades dentro de Product para precargar la pantalla de nuevo producto si no hay un ID: 
        return {
            id: 'new',
            title: '',
            price: 0,
            description: '',
            slug: '',
            stock: 0,
            sizes: [],
            gender: 'men',
            tags: [],
            images: []
        } as unknown as Product
    }

    const { data } = await tesloApi.get<Product>(`/products/${id}`);

    // transformando las imagenes: 
    const images = data.images.map(image => {
        if (image.includes('http')) return image;
        return `${import.meta.env.VITE_API_URL}/files/product/${image}`;
    });

    return {
        ...data,
        images
    };
};