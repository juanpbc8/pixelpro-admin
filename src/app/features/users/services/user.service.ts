import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, UserCreateRequest, UserUpdateRequest, UserQueryParams, Page } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/users`;

    /**
     * Obtiene la lista de usuarios con filtros y paginación
     */
    getUsers(params: UserQueryParams): Observable<Page<User>> {
        const httpParams = this.buildQueryParams(params);
        return this.http.get<Page<User>>(this.baseUrl, { params: httpParams });
    }

    /**
     * Obtiene un usuario por su ID
     */
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }

    /**
     * Crea un nuevo usuario
     */
    createUser(request: UserCreateRequest): Observable<User> {
        return this.http.post<User>(this.baseUrl, request);
    }

    /**
     * Actualiza un usuario existente
     */
    updateUser(id: number, request: UserUpdateRequest): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${id}`, request);
    }

    /**
     * Alterna el estado de activación del usuario (toggle)
     * Cambia entre activo/inactivo automáticamente
     */
    toggleUserStatus(id: number): Observable<User> {
        return this.http.patch<User>(`${this.baseUrl}/${id}/toggle-status`, {});
    }

    /**
     * Actualiza la contraseña de un usuario
     * Usa PATCH /api/admin/users/{id}/password con PasswordUpdateDto
     */
    resetPassword(id: number, password: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/${id}/password`, { password });
    }

    /**
     * Obtiene todos los roles disponibles del sistema
     * El backend devuelve un array de strings con los nombres de los roles
     */
    getRoles(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/roles`);
    }

    /**
     * Obtiene solo los roles de staff (excluye CLIENTE)
     * Este método es utilizado en el panel de administración para gestionar usuarios del staff
     */
    getStaffRoles(): Observable<string[]> {
        return this.getRoles().pipe(
            map(roles => roles.filter(role => role !== 'CLIENTE'))
        );
    }

    /**
     * Construye los parámetros HTTP para las consultas
     */
    private buildQueryParams(filters: UserQueryParams): HttpParams {
        let params = new HttpParams();

        if (filters.search) {
            params = params.set('search', filters.search);
        }

        if (filters.role) {
            params = params.set('role', filters.role);
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
