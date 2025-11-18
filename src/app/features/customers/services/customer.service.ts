import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    readonly customers = signal<Customer[]>([]);
    readonly selectedCustomer = signal<Customer | null>(null);
    readonly loading = signal<boolean>(false);

    constructor() {
        this.initializeMockCustomers();
    }

    private initializeMockCustomers(): void {
        const mockCustomers: Customer[] = [
            {
                id: 1,
                userId: 101,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '12345678',
                firstName: 'Juan',
                lastName: 'Pérez García',
                email: 'juan.perez@email.com',
                phoneNumber: '987654321',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-06-20T14:25:00Z',
                addresses: [
                    {
                        id: 1,
                        type: 'Principal',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Miraflores',
                        addressLine: 'Av. Larco 1234, Dpto 501',
                        reference: 'Edificio Torre Azul, frente al parque',
                        phone: '987654321',
                        createdAt: '2024-01-15T10:30:00Z',
                        updatedAt: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        type: 'Trabajo',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'San Isidro',
                        addressLine: 'Av. Javier Prado Este 2500',
                        reference: 'Torre empresarial, piso 12',
                        phone: '987654321',
                        createdAt: '2024-02-10T09:15:00Z',
                        updatedAt: '2024-02-10T09:15:00Z'
                    }
                ]
            },
            {
                id: 2,
                userId: 102,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '87654321',
                firstName: 'María',
                lastName: 'González Rodríguez',
                email: 'maria.gonzalez@email.com',
                phoneNumber: '912345678',
                createdAt: '2024-02-10T11:45:00Z',
                updatedAt: '2024-07-15T16:30:00Z',
                addresses: [
                    {
                        id: 3,
                        type: 'Principal',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Surco',
                        addressLine: 'Av. Primavera 1800',
                        reference: null,
                        phone: '912345678',
                        createdAt: '2024-02-10T11:45:00Z',
                        updatedAt: '2024-02-10T11:45:00Z'
                    }
                ]
            },
            {
                id: 3,
                userId: null,
                customerType: 'jurídica',
                documentType: 'RUC',
                documentNumber: '20123456789',
                firstName: 'Empresa',
                lastName: 'PixelTech SAC',
                email: 'contacto@pixeltech.com',
                phoneNumber: '998765432',
                createdAt: '2024-03-05T08:20:00Z',
                updatedAt: '2024-08-12T10:45:00Z',
                addresses: [
                    {
                        id: 4,
                        type: 'Oficina Principal',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'San Isidro',
                        addressLine: 'Calle Los Laureles 456',
                        reference: 'Edificio corporativo azul',
                        phone: '998765432',
                        createdAt: '2024-03-05T08:20:00Z',
                        updatedAt: '2024-03-05T08:20:00Z'
                    },
                    {
                        id: 5,
                        type: 'Almacén',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Villa El Salvador',
                        addressLine: 'Av. Industrial 2000',
                        reference: 'Zona industrial, entrada por portón rojo',
                        phone: '998765432',
                        createdAt: '2024-03-20T14:00:00Z',
                        updatedAt: '2024-03-20T14:00:00Z'
                    },
                    {
                        id: 6,
                        type: 'Sucursal',
                        department: 'Arequipa',
                        province: 'Arequipa',
                        district: 'Cayma',
                        addressLine: 'Av. Ejército 789',
                        reference: 'Al lado del centro comercial',
                        phone: '945678901',
                        createdAt: '2024-04-10T09:30:00Z',
                        updatedAt: '2024-04-10T09:30:00Z'
                    }
                ]
            },
            {
                id: 4,
                userId: 103,
                customerType: 'natural',
                documentType: 'CE',
                documentNumber: 'CE123456',
                firstName: 'Carlos',
                lastName: 'Rodríguez Sánchez',
                email: 'carlos.rodriguez@email.com',
                phoneNumber: '923456789',
                createdAt: '2024-04-20T13:15:00Z',
                updatedAt: '2024-09-05T11:20:00Z',
                addresses: [
                    {
                        id: 7,
                        type: 'Principal',
                        department: 'Arequipa',
                        province: 'Arequipa',
                        district: 'Yanahuara',
                        addressLine: 'Calle Los Pinos 456',
                        reference: 'Casa blanca con portón negro',
                        phone: '923456789',
                        createdAt: '2024-04-20T13:15:00Z',
                        updatedAt: '2024-04-20T13:15:00Z'
                    }
                ]
            },
            {
                id: 5,
                userId: 104,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '45678912',
                firstName: 'Ana',
                lastName: 'Martínez López',
                email: 'ana.martinez@email.com',
                phoneNumber: '934567890',
                createdAt: '2024-05-10T09:30:00Z',
                updatedAt: '2024-10-18T15:45:00Z',
                addresses: [
                    {
                        id: 8,
                        type: 'Principal',
                        department: 'Cusco',
                        province: 'Cusco',
                        district: 'Wanchaq',
                        addressLine: 'Jr. Libertadores 789',
                        reference: 'Frente al parque principal',
                        phone: '934567890',
                        createdAt: '2024-05-10T09:30:00Z',
                        updatedAt: '2024-05-10T09:30:00Z'
                    },
                    {
                        id: 9,
                        type: 'Secundaria',
                        department: 'Cusco',
                        province: 'Cusco',
                        district: 'Santiago',
                        addressLine: 'Av. La Cultura 1500',
                        reference: 'Condominio Los Andes, casa 15',
                        phone: '934567890',
                        createdAt: '2024-06-15T10:00:00Z',
                        updatedAt: '2024-06-15T10:00:00Z'
                    }
                ]
            },
            {
                id: 6,
                userId: 105,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '78912345',
                firstName: 'Luis',
                lastName: 'Torres Vega',
                email: 'luis.torres@email.com',
                phoneNumber: '945678901',
                createdAt: '2024-06-15T14:20:00Z',
                updatedAt: '2024-11-01T09:10:00Z',
                addresses: [
                    {
                        id: 10,
                        type: 'Principal',
                        department: 'La Libertad',
                        province: 'Trujillo',
                        district: 'Victor Larco',
                        addressLine: 'Av. Larco 3500',
                        reference: 'Edificio verde, 3er piso',
                        phone: '945678901',
                        createdAt: '2024-06-15T14:20:00Z',
                        updatedAt: '2024-06-15T14:20:00Z'
                    }
                ]
            },
            {
                id: 7,
                userId: null,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '65412378',
                firstName: 'Patricia',
                lastName: 'Vega Morales',
                email: 'patricia.vega@email.com',
                phoneNumber: '956789012',
                createdAt: '2024-07-20T16:40:00Z',
                updatedAt: '2024-07-20T16:40:00Z',
                addresses: []
            },
            {
                id: 8,
                userId: 106,
                customerType: 'jurídica',
                documentType: 'RUC',
                documentNumber: '20987654321',
                firstName: 'Comercial',
                lastName: 'TecnoPlus EIRL',
                email: 'ventas@tecnoplus.com',
                phoneNumber: '967890123',
                createdAt: '2024-08-05T10:15:00Z',
                updatedAt: '2024-10-30T13:25:00Z',
                addresses: [
                    {
                        id: 11,
                        type: 'Oficina',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Lince',
                        addressLine: 'Av. Arenales 2800',
                        reference: 'Cerca al estadio',
                        phone: '967890123',
                        createdAt: '2024-08-05T10:15:00Z',
                        updatedAt: '2024-08-05T10:15:00Z'
                    }
                ]
            },
            {
                id: 9,
                userId: 107,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '32165498',
                firstName: 'Roberto',
                lastName: 'Silva Campos',
                email: 'roberto.silva@email.com',
                phoneNumber: '978901234',
                createdAt: '2024-09-12T11:50:00Z',
                updatedAt: '2024-11-10T14:15:00Z',
                addresses: [
                    {
                        id: 12,
                        type: 'Principal',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Barranco',
                        addressLine: 'Jr. Colina 567',
                        reference: 'Casa esquina, color beige',
                        phone: '978901234',
                        createdAt: '2024-09-12T11:50:00Z',
                        updatedAt: '2024-09-12T11:50:00Z'
                    }
                ]
            },
            {
                id: 10,
                userId: 108,
                customerType: 'natural',
                documentType: 'DNI',
                documentNumber: '85296374',
                firstName: 'Sofía',
                lastName: 'Ramírez Cruz',
                email: 'sofia.ramirez@email.com',
                phoneNumber: '989012345',
                createdAt: '2024-10-08T15:30:00Z',
                updatedAt: '2024-11-15T10:00:00Z',
                addresses: [
                    {
                        id: 13,
                        type: 'Principal',
                        department: 'Lima',
                        province: 'Lima',
                        district: 'Pueblo Libre',
                        addressLine: 'Av. La Marina 2340',
                        reference: 'Condominio Las Palmeras, torre B, dpto 402',
                        phone: '989012345',
                        createdAt: '2024-10-08T15:30:00Z',
                        updatedAt: '2024-10-08T15:30:00Z'
                    },
                    {
                        id: 14,
                        type: 'Envío alternativo',
                        department: 'Lima',
                        province: 'Callao',
                        district: 'Bellavista',
                        addressLine: 'Av. Oscar Benavides 890',
                        reference: 'Edificio Los Portales',
                        phone: '989012345',
                        createdAt: '2024-10-20T09:00:00Z',
                        updatedAt: '2024-10-20T09:00:00Z'
                    }
                ]
            }
        ];

        this.customers.set(mockCustomers);
    }

    getCustomers(): Observable<Customer[]> {
        return of(this.customers()).pipe(delay(300));
    }

    getCustomerById(id: number): Observable<Customer | undefined> {
        const customer = this.customers().find(c => c.id === id);
        return of(customer).pipe(delay(300));
    }

    loadCustomer(id: number): void {
        this.loading.set(true);
        this.getCustomerById(id).subscribe({
            next: (customer) => {
                this.selectedCustomer.set(customer || null);
                this.loading.set(false);
            },
            error: (error: Error) => {
                console.error('Error loading customer:', error);
                this.selectedCustomer.set(null);
                this.loading.set(false);
            }
        });
    }

    deleteCustomer(id: number): Observable<void> {
        this.customers.update(customers => customers.filter(c => c.id !== id));
        return of(void 0).pipe(delay(300));
    }
}
