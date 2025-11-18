export interface Address {
    id: number;
    department: string;
    district: string;
    province: string;
    addressLine: string;
    reference?: string | null;
    phone: string;
}
