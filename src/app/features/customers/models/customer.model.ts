import { Address } from './address.model';

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
