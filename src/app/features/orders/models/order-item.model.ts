export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productSku: string;
    productImageUrl: string | null;
    quantity: number;
    unitPrice: number;
}
