import { Role } from './role.model';

export interface User {
    id: number;
    email: string;
    enabled: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;
}
