export interface Invoice {
    id: number;
    number: string;
    serie: string;
    type: string;
    status: string;
    documentUrl?: string | null;
    hashValue?: string | null;
    totalAmount: number;
    currency: string;
    createdAt: string;
    issuedAt?: string;
}
