export interface Category {
    id: number;
    name: string;
    parentCategoryId?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryDto {
    name: string;
    parentCategoryId?: number | null;
}

export interface UpdateCategoryDto {
    name: string;
    parentCategoryId?: number | null;
}

export interface CategoryQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    parentId?: number;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
