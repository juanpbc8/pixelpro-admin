import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'imageUrl',
    standalone: true
})
export class ImageUrlPipe implements PipeTransform {
    transform(relativePath: string | null | undefined): string {
        if (!relativePath || relativePath.trim() === '') {
            return 'assets/img/no-image.png';
        }

        // Si ya es una URL completa, devolverla sin cambios
        if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
            return relativePath;
        }

        // Construir URL absoluta desde ruta relativa
        return `${environment.apiUrl}${relativePath}`;
    }
}
