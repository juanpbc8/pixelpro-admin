/**
 * Interfaz genérica para respuestas paginadas del backend (Spring Data Page)
 * Representa la estructura estándar de paginación utilizada en toda la aplicación
 */
export interface Page<T> {
    /** Array de elementos de la página actual */
    content: T[];
    /** Número total de elementos en todas las páginas */
    totalElements: number;
    /** Número total de páginas */
    totalPages: number;
    /** Tamaño de la página (elementos por página) */
    size: number;
    /** Número de la página actual (basado en 0) */
    number: number;
    /** Número de elementos en la página actual */
    numberOfElements: number;
    /** Indica si es la primera página */
    first: boolean;
    /** Indica si es la última página */
    last: boolean;
    /** Indica si la página está vacía */
    empty: boolean;
}
