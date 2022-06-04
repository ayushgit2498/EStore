export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    type?: string; // ? indicates optional
    brand: string;
    quantityInStock?: number;
}

export interface ProductParams {
    orderByArgument: string,
    searchTerm?: string,
    brands: string[],
    types: string[],
    pageNumber: number,
    pageSize: number
}