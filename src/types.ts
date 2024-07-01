export interface Product {
    id: string;
    image: string;
    name: string;
    description: string;
    type: string;
    products: ProductDetail[];
}

export interface JobDetail {
    header: string;
    content: string;
}

export interface NavDetails {
    id: string;
    name: string
}

export interface ProductDetail {
    id: string;
    image: string;
    title: string;
    rating: number;
    regularPrice: number | null;
    salePrice: number;
    quantity: number;
    description: string;
    category: string;
    ingredients: string[];
    count: number;
}


export interface Job {
    id: string;
    title: string;
    details: JobDetail[];
}
