export interface Payment {
    id: number;
    amount: number;
    currency: string;
    method: string;
    status: string;
    transactionId: string;
    createdAt: string;
    paidAt?: string | null;
}
