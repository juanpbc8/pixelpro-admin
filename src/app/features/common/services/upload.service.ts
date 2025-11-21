import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private readonly http = inject(HttpClient);
    private readonly uploadUrl = `${environment.apiUrl}/api/admin/uploads/products`;

    uploadProductImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);

        // El backend retorna text/plain (raw string), no JSON
        return this.http.post(this.uploadUrl, formData, { responseType: 'text' });
    }
}
