import { OrderItem } from './order-item.model';
import { Payment } from './payment.model';
import { Invoice } from './invoice.model';
import { Customer } from './customer.model';
import { Address } from './address.model';

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
    shippingAddress: Address;

    items: OrderItem[];
    payments: Payment[];
    invoice?: Invoice | null;
}
