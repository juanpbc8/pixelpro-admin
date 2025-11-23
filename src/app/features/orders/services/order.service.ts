import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderQueryParams, OrderStatusUpdateDto } from '../models/order.model';
import { Page } from '../../../shared/models/page.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/orders`;

    /**
     * Obtiene todas las órdenes con filtros y paginación del servidor
     */
    getAllOrders(params: OrderQueryParams = {}): Observable<Page<Order>> {
        const httpParams = this.buildQueryParams(params);
        return this.http.get<Page<Order>>(this.baseUrl, { params: httpParams });
    }

    /**
     * Obtiene una orden específica por ID
     */
    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/${id}`);
    }

    /**
     * Actualiza el estado de una orden
     */
    updateOrderStatus(id: number, status: string): Observable<Order> {
        const body: OrderStatusUpdateDto = { status };
        return this.http.patch<Order>(`${this.baseUrl}/${id}/status`, body);
    }

    /**
     * Construye los HttpParams dinámicamente basado en los filtros proporcionados
     */
    private buildQueryParams(params: OrderQueryParams): HttpParams {
        let httpParams = new HttpParams();

        if (params.search) {
            httpParams = httpParams.set('search', params.search);
        }
        if (params.status) {
            httpParams = httpParams.set('status', params.status);
        }
        if (params.deliveryType) {
            httpParams = httpParams.set('deliveryType', params.deliveryType);
        }
        if (params.page !== undefined) {
            httpParams = httpParams.set('page', params.page.toString());
        }
        if (params.size !== undefined) {
            httpParams = httpParams.set('size', params.size.toString());
        }
        if (params.sort) {
            httpParams = httpParams.set('sort', params.sort);
        }

        return httpParams;
    }
}
