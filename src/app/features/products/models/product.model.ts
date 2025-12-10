import { Category } from '../../categories/models/category.model';

export interface Product {
    id: number;
    sku: string;
    name: string;
    model: string | null;
    description: string | null;
    price: number;
    imageUrl: string | null;
    status: string;
    qtyStock: number;
    category: Category;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDto {
    sku: string;
    name: string;
    model?: string;
    description?: string;
    price: number;
    qtyStock: number;
    status: string;
    categoryId: number;
    imageUrl?: string;
}

export interface UpdateProductDto {
    name?: string;
    model?: string;
    description?: string;
    price?: number;
    qtyStock?: number;
    status?: string;
    categoryId?: number;
    imageUrl?: string;
}

export interface ProductQueryParams {
    search?: string;
    status?: string;
    categoryId?: number;
    page?: number;
    size?: number;
    sort?: string;
}
