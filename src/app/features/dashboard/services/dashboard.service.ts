import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/dashboard`;

    /**
     * Obtiene todas las estadísticas del dashboard desde el servidor
     */
    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(this.baseUrl);
    }
}
