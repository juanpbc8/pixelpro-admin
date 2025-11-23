import { Page } from '../../../shared/models/page.model';

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
    staffOnly?: boolean;
    page?: number;
    size?: number;
    sort?: string;
}
