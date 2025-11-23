import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Servicio centralizado para mostrar alertas y confirmaciones usando SweetAlert2.
 * Proporciona una interfaz consistente para feedback de usuario en toda la aplicación.
 * 
 * - Toasts (no bloqueantes): success, error, info, warning
 * - Modales (bloqueantes): confirm, confirmDelete
 */
@Injectable({
    providedIn: 'root'
})
export class AlertService {

    /**
     * Configuración de Toast para notificaciones no bloqueantes.
     * Aparece en la esquina inferior derecha, se auto-cierra en 3 segundos.
     */
    private readonly Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    /**
     * Muestra un toast de éxito (no bloqueante, esquina inferior derecha)
     * @param title Título del mensaje
     * @param text Texto adicional (opcional)
     */
    success(title: string, text?: string): void {
        this.Toast.fire({
            icon: 'success',
            title: title,
            text: text
        });
    }

    /**
     * Muestra un toast de error (no bloqueante, esquina inferior derecha)
     * @param title Título del mensaje
     * @param text Texto adicional (opcional)
     */
    error(title: string, text?: string): void {
        this.Toast.fire({
            icon: 'error',
            title: title,
            text: text
        });
    }

    /**
     * Muestra un toast de información (no bloqueante, esquina inferior derecha)
     * @param title Título del mensaje
     * @param text Texto adicional (opcional)
     */
    info(title: string, text?: string): void {
        this.Toast.fire({
            icon: 'info',
            title: title,
            text: text
        });
    }

    /**
     * Muestra un toast de advertencia (no bloqueante, esquina inferior derecha)
     * @param title Título del mensaje
     * @param text Texto adicional (opcional)
     */
    warning(title: string, text?: string): void {
        this.Toast.fire({
            icon: 'warning',
            title: title,
            text: text
        });
    }

    /**
     * Muestra un diálogo de confirmación
     * @param title Título de la confirmación
     * @param text Texto descriptivo
     * @param confirmButtonText Texto del botón de confirmación
     * @returns Promise<boolean> - true si el usuario confirma, false si cancela
     */
    async confirm(
        title: string,
        text: string,
        confirmButtonText: string = 'Confirmar'
    ): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0d6efd',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            focusCancel: true
        });

        return result.isConfirmed;
    }

    /**
     * Muestra un diálogo de confirmación para acciones destructivas (ej: eliminar)
     * @param title Título de la confirmación
     * @param text Texto descriptivo
     * @param confirmButtonText Texto del botón de confirmación
     * @returns Promise<boolean> - true si el usuario confirma, false si cancela
     */
    async confirmDelete(
        title: string = '¿Estás seguro?',
        text: string = 'Esta acción no se puede deshacer',
        confirmButtonText: string = 'Sí, eliminar'
    ): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
            focusCancel: true
        });

        return result.isConfirmed;
    }

    /**
     * Muestra una alerta con loading (útil para operaciones asíncronas)
     * @param title Título del mensaje
     */
    showLoading(title: string = 'Procesando...'): void {
        Swal.fire({
            title: title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    /**
     * Cierra cualquier alerta activa
     */
    close(): void {
        Swal.close();
    }
}
