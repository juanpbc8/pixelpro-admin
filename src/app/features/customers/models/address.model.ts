export interface Address {
    id: number;
    type: string;

    department: string;
    province: string;
    district: string;

    addressLine: string;
    reference?: string | null;

    phone: string;

    createdAt: string;
    updatedAt: string;
}
