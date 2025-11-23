/**
 * Modelo de usuario autenticado
 */
export interface User {
    id: number;
    email: string;
    rol: string;
    authenticated: boolean;
}

/**
 * Credenciales de login
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Respuesta de autenticación del backend
 */
export interface AuthResponse {
    id: number;
    email: string;
    rol: string;
    authenticated: boolean;
}
