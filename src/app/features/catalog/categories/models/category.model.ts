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
