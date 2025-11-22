import { Address } from './address.model';

export enum DocumentType {
    DNI = 'DNI',
    RUC = 'RUC',
    PASAPORTE = 'PASAPORTE'
}

export enum CustomerType {
    NATURAL = 'NATURAL',
    JURIDICA = 'JURIDICA'
}

export interface Customer {
    id: number;
    userId?: number | null;
    customerType: string;
    documentType: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    addresses: Address[];
}

export interface CustomerQueryParams {
    search?: string;
    documentType?: string;
    customerType?: string;
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
