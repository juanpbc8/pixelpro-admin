export interface User {
    id: number;
    email: string;
    enabled: boolean;
    roleName: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreateRequest {
    email: string;
    password: string;
    role: string;
}

export interface UserUpdateRequest {
    email: string;
    role: string;
    enabled: boolean;
}

export interface UserQueryParams {
    search?: string;
    role?: string;
    page?: number;
    size?: number;
    sort?: string;
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
