import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginRequest } from '../../../../core/auth/auth.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly isSubmitting = signal<boolean>(false);
    readonly errorMessage = signal<string>('');

    loginForm: FormGroup;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        const credentials: LoginRequest = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };

        this.authService.login(credentials).subscribe({
            next: () => {
                // Login exitoso, navegar al dashboard
                this.router.navigate(['/dashboard']);
            },
            error: (error: HttpErrorResponse | Error) => {
                this.isSubmitting.set(false);

                // Manejar diferentes tipos de errores
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        this.errorMessage.set('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
                    } else if (error.status === 0) {
                        this.errorMessage.set('Error de conexión. Por favor, verifica tu conexión a internet.');
                    } else {
                        this.errorMessage.set('Error al iniciar sesión. Por favor, intenta nuevamente.');
                    }
                } else {
                    // Error de negocio (ej: usuario CLIENTE intentando acceder)
                    this.errorMessage.set(error.message);
                }
            }
        });
    }

    getErrorMessage(fieldName: string): string {
        const control = this.loginForm.get(fieldName);

        if (!control || !control.touched || !control.errors) {
            return '';
        }

        if (control.errors['required']) {
            if (fieldName === 'email') return 'El correo electrónico es obligatorio.';
            if (fieldName === 'password') return 'La contraseña es obligatoria.';
        }

        if (fieldName === 'email' && control.errors['email']) {
            return 'Ingrese un correo electrónico válido.';
        }

        if (fieldName === 'password' && control.errors['minlength']) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }

        return '';
    }
}
