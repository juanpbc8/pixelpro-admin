import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerQueryParams, Page } from '../models/customer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/customers`;

    getCustomers(params: CustomerQueryParams = {}): Observable<Page<Customer>> {
        const httpParams = this.buildQueryParams(params);
        return this.http.get<Page<Customer>>(this.baseUrl, { params: httpParams });
    }

    getCustomerById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    }

    private buildQueryParams(filters: CustomerQueryParams): HttpParams {
        let params = new HttpParams();

        if (filters.search) {
            params = params.set('search', filters.search);
        }
        if (filters.documentType) {
            params = params.set('documentType', filters.documentType);
        }
        if (filters.customerType) {
            params = params.set('customerType', filters.customerType);
        }
        if (filters.page !== undefined) {
            params = params.set('page', filters.page.toString());
        }
        if (filters.size !== undefined) {
            params = params.set('size', filters.size.toString());
        }
        if (filters.sort) {
            params = params.set('sort', filters.sort);
        }

        return params;
    }
}
