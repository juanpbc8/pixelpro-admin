import { Category } from './category.model';

export interface Product {
    id?: number;
    sku: string;
    name: string;
    model?: string | null;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    qtyStock: number;
    categories: Category[];
    createdAt?: string;
    updatedAt?: string;
}
