import { OrderItem } from './order-item.model';
import { Payment } from './payment.model';
import { Invoice } from './invoice.model';
import { Customer } from './customer.model';
import { Address } from './address.model';

export enum OrderStatus {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADO = 'CONFIRMADO',
    PREPARANDO = 'PREPARANDO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO',
    CANCELADO = 'CANCELADO'
}

export enum DeliveryType {
    A_DOMICILIO = 'A_DOMICILIO',
    RECOJO_EN_TIENDA = 'RECOJO_EN_TIENDA'
}

export interface Order {
    id: number;
    code: string;
    status: string;
    deliveryType: string;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    createdAt: string;
    updatedAt: string;

    customer: Customer;
    address: Address | null; // Puede ser null si es recojo en tienda

    items: OrderItem[];
    payments: Payment[];
    invoice: Invoice | null;
}

export interface OrderQueryParams {
    search?: string;
    status?: string;
    deliveryType?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export interface OrderStatusUpdateDto {
    status: string;
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
