import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Payment } from '../models/payment.model';
import { Invoice } from '../models/invoice.model';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    readonly orders = signal<Order[]>([]);
    readonly selectedOrder = signal<Order | null>(null);
    readonly loading = signal<boolean>(false);

    constructor() {
        this.initializeMockOrders();
    }

    private initializeMockOrders(): void {
        const mockOrders: Order[] = [
            {
                id: 1,
                code: 'ORD-2025-0001',
                status: 'Completado',
                deliveryType: 'Envío a domicilio',
                subtotal: 1899.98,
                shippingCost: 25.00,
                discount: 50.00,
                total: 1874.98,
                createdAt: '2025-11-15T10:30:00Z',
                updatedAt: '2025-11-16T14:20:00Z',
                customer: this.createMockCustomer(1, 'Juan', 'Pérez', 'DNI', '12345678', 'juan.perez@email.com', '+51987654321'),
                shippingAddress: this.createMockAddress(1, 'Lima', 'Miraflores', 'Lima', 'Av. Larco 1234, Dpto 501', 'Edificio Torre Azul', '+51987654321'),
                items: [
                    { id: 1, productId: 1, productName: 'Laptop HP Pavilion', quantity: 1, unitPrice: 899.99 },
                    { id: 2, productId: 2, productName: 'Mouse Logitech MX', quantity: 2, unitPrice: 499.99 }
                ],
                payments: [
                    {
                        id: 1,
                        amount: 1874.98,
                        currency: 'PEN',
                        method: 'Tarjeta de crédito',
                        status: 'Pagado',
                        transactionId: 'TXN-20250115-001',
                        createdAt: '2025-11-15T10:35:00Z',
                        paidAt: '2025-11-15T10:35:30Z'
                    }
                ],
                invoice: {
                    id: 1,
                    number: '001-00000123',
                    serie: 'F001',
                    type: 'Factura',
                    status: 'Emitida',
                    documentUrl: 'https://example.com/invoices/001-00000123.pdf',
                    hashValue: 'abc123def456',
                    totalAmount: 1874.98,
                    currency: 'PEN',
                    createdAt: '2025-11-15T10:40:00Z',
                    issuedAt: '2025-11-15T10:40:00Z'
                }
            },
            {
                id: 2,
                code: 'ORD-2025-0002',
                status: 'Pendiente',
                deliveryType: 'Recojo en tienda',
                subtotal: 799.99,
                shippingCost: 0,
                discount: 0,
                total: 799.99,
                createdAt: '2025-11-16T09:15:00Z',
                updatedAt: '2025-11-16T09:15:00Z',
                customer: this.createMockCustomer(2, 'María', 'González', 'DNI', '87654321', 'maria.gonzalez@email.com', '+51912345678'),
                shippingAddress: this.createMockAddress(2, 'Lima', 'San Isidro', 'Lima', 'Av. Javier Prado 2500', null, '+51912345678'),
                items: [
                    { id: 3, productId: 3, productName: 'Samsung Galaxy S23', quantity: 1, unitPrice: 799.99 }
                ],
                payments: [
                    {
                        id: 2,
                        amount: 799.99,
                        currency: 'PEN',
                        method: 'Transferencia bancaria',
                        status: 'Pendiente',
                        transactionId: 'TXN-20250116-002',
                        createdAt: '2025-11-16T09:20:00Z',
                        paidAt: null
                    }
                ],
                invoice: null
            },
            {
                id: 3,
                code: 'ORD-2025-0003',
                status: 'Completado',
                deliveryType: 'Envío a domicilio',
                subtotal: 349.99,
                shippingCost: 15.00,
                discount: 10.00,
                total: 354.99,
                createdAt: '2025-11-17T14:45:00Z',
                updatedAt: '2025-11-18T11:30:00Z',
                customer: this.createMockCustomer(3, 'Carlos', 'Rodríguez', 'DNI', '45678912', 'carlos.rodriguez@email.com', '+51998765432'),
                shippingAddress: this.createMockAddress(3, 'Arequipa', 'Cayma', 'Arequipa', 'Calle Los Pinos 456', 'Casa blanca con portón negro', '+51998765432'),
                items: [
                    { id: 4, productId: 4, productName: 'Escritorio Ejecutivo', quantity: 1, unitPrice: 349.99 }
                ],
                payments: [
                    {
                        id: 3,
                        amount: 354.99,
                        currency: 'PEN',
                        method: 'Efectivo contra entrega',
                        status: 'Pagado',
                        transactionId: 'TXN-20250118-003',
                        createdAt: '2025-11-18T11:30:00Z',
                        paidAt: '2025-11-18T11:30:00Z'
                    }
                ],
                invoice: {
                    id: 2,
                    number: '001-00000124',
                    serie: 'B001',
                    type: 'Boleta',
                    status: 'Emitida',
                    documentUrl: 'https://example.com/invoices/001-00000124.pdf',
                    hashValue: 'xyz789abc123',
                    totalAmount: 354.99,
                    currency: 'PEN',
                    createdAt: '2025-11-18T11:35:00Z',
                    issuedAt: '2025-11-18T11:35:00Z'
                }
            },
            {
                id: 4,
                code: 'ORD-2025-0004',
                status: 'Cancelado',
                deliveryType: 'Envío a domicilio',
                subtotal: 599.99,
                shippingCost: 20.00,
                discount: 0,
                total: 619.99,
                createdAt: '2025-11-18T16:20:00Z',
                updatedAt: '2025-11-19T10:00:00Z',
                customer: this.createMockCustomer(4, 'Ana', 'Martínez', 'DNI', '78912345', 'ana.martinez@email.com', '+51923456789'),
                shippingAddress: this.createMockAddress(4, 'Cusco', 'Wanchaq', 'Cusco', 'Jr. Libertadores 789', 'Frente al parque', '+51923456789'),
                items: [
                    { id: 5, productId: 5, productName: 'Bicicleta de Montaña', quantity: 1, unitPrice: 599.99 }
                ],
                payments: [
                    {
                        id: 4,
                        amount: 619.99,
                        currency: 'PEN',
                        method: 'Tarjeta de débito',
                        status: 'Cancelado',
                        transactionId: 'TXN-20250118-004',
                        createdAt: '2025-11-18T16:25:00Z',
                        paidAt: null
                    }
                ],
                invoice: null
            },
            {
                id: 5,
                code: 'ORD-2025-0005',
                status: 'Completado',
                deliveryType: 'Recojo en tienda',
                subtotal: 145.97,
                shippingCost: 0,
                discount: 5.97,
                total: 140.00,
                createdAt: '2025-11-19T11:10:00Z',
                updatedAt: '2025-11-19T15:30:00Z',
                customer: this.createMockCustomer(5, 'Luis', 'Torres', 'CE', 'CE123456', 'luis.torres@email.com', '+51934567890'),
                shippingAddress: this.createMockAddress(5, 'Lima', 'Surco', 'Lima', 'Av. Primavera 1800', null, '+51934567890'),
                items: [
                    { id: 6, productId: 6, productName: 'Camisa Polo Nike', quantity: 3, unitPrice: 45.99 }
                ],
                payments: [
                    {
                        id: 5,
                        amount: 70.00,
                        currency: 'PEN',
                        method: 'Tarjeta de crédito',
                        status: 'Pagado',
                        transactionId: 'TXN-20250119-005A',
                        createdAt: '2025-11-19T11:15:00Z',
                        paidAt: '2025-11-19T11:15:20Z'
                    },
                    {
                        id: 6,
                        amount: 70.00,
                        currency: 'PEN',
                        method: 'Tarjeta de crédito',
                        status: 'Pagado',
                        transactionId: 'TXN-20250119-005B',
                        createdAt: '2025-11-19T11:15:00Z',
                        paidAt: '2025-11-19T11:15:30Z'
                    }
                ],
                invoice: {
                    id: 3,
                    number: '001-00000125',
                    serie: 'F001',
                    type: 'Factura',
                    status: 'Emitida',
                    documentUrl: null,
                    hashValue: 'mno456pqr789',
                    totalAmount: 140.00,
                    currency: 'PEN',
                    createdAt: '2025-11-19T15:35:00Z',
                    issuedAt: '2025-11-19T15:35:00Z'
                }
            },
            {
                id: 6,
                code: 'ORD-2025-0006',
                status: 'Pendiente',
                deliveryType: 'Envío a domicilio',
                subtotal: 2199.97,
                shippingCost: 30.00,
                discount: 100.00,
                total: 2129.97,
                createdAt: '2025-11-20T08:30:00Z',
                updatedAt: '2025-11-20T08:30:00Z',
                customer: this.createMockCustomer(6, 'Patricia', 'Vega', 'DNI', '65412378', 'patricia.vega@email.com', '+51945678901'),
                shippingAddress: this.createMockAddress(6, 'Trujillo', 'Victor Larco', 'La Libertad', 'Av. Larco 3500', 'Edificio verde, 3er piso', '+51945678901'),
                items: [
                    { id: 7, productId: 1, productName: 'Laptop HP Pavilion', quantity: 1, unitPrice: 899.99 },
                    { id: 8, productId: 2, productName: 'Samsung Galaxy S23', quantity: 1, unitPrice: 799.99 },
                    { id: 9, productId: 7, productName: 'Teclado mecánico', quantity: 1, unitPrice: 499.99 }
                ],
                payments: [
                    {
                        id: 7,
                        amount: 2129.97,
                        currency: 'PEN',
                        method: 'Yape',
                        status: 'Pendiente',
                        transactionId: 'TXN-20250120-006',
                        createdAt: '2025-11-20T08:35:00Z',
                        paidAt: null
                    }
                ],
                invoice: null
            }
        ];

        this.orders.set(mockOrders);
    }

    private createMockCustomer(
        id: number,
        firstName: string,
        lastName: string,
        documentType: string,
        documentNumber: string,
        email: string,
        phoneNumber: string
    ): Customer {
        return { id, firstName, lastName, documentType, documentNumber, email, phoneNumber };
    }

    private createMockAddress(
        id: number,
        department: string,
        district: string,
        province: string,
        addressLine: string,
        reference: string | null,
        phone: string
    ): Address {
        return { id, department, district, province, addressLine, reference, phone };
    }

    getOrders(): Observable<Order[]> {
        return of(this.orders()).pipe(delay(300));
    }

    getOrderById(id: number): Observable<Order | undefined> {
        const order = this.orders().find(o => o.id === id);
        return of(order).pipe(delay(300));
    }

    loadOrder(id: number): void {
        this.loading.set(true);
        this.getOrderById(id).subscribe({
            next: (order) => {
                this.selectedOrder.set(order || null);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading order:', error);
                this.selectedOrder.set(null);
                this.loading.set(false);
            }
        });
    }

    deleteOrder(id: number): Observable<void> {
        this.orders.update(orders => orders.filter(o => o.id !== id));
        return of(void 0).pipe(delay(300));
    }

    updateOrderStatus(id: number, status: string): Observable<Order | undefined> {
        const index = this.orders().findIndex(o => o.id === id);

        if (index === -1) {
            return of(undefined).pipe(delay(300));
        }

        const updatedOrder: Order = {
            ...this.orders()[index],
            status,
            updatedAt: new Date().toISOString()
        };

        this.orders.update(orders => {
            const newOrders = [...orders];
            newOrders[index] = updatedOrder;
            return newOrders;
        });

        return of(updatedOrder).pipe(delay(300));
    }
}
