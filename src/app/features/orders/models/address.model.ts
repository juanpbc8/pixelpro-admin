export interface Address {
    id: number;
    addressType: string;
    department: string;
    province: string;
    district: string;
    addressLine: string;
    addressReference: string | null;
    addressPhone: string;
}
