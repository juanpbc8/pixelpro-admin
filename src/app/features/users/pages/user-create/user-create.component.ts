import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserCreateRequest } from '../../models/user.model';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class UserCreateComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly alertService = inject(AlertService);

    readonly staffRoles = signal<string[]>([]);
    readonly isSubmitting = signal<boolean>(false);
    readonly showPassword = signal<boolean>(false);
    readonly showConfirmPassword = signal<boolean>(false);
    userForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        // Cargar solo roles de staff del backend (excluye CLIENTE automáticamente)
        this.userService.getStaffRoles().subscribe({
            next: (roles) => {
                this.staffRoles.set(roles);
                // Setear ADMIN como default si existe, si no el primer rol disponible
                const defaultRole = roles.find(r => r === 'ADMIN') || roles[0];
                if (defaultRole) {
                    this.userForm.patchValue({ role: defaultRole });
                }
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading staff roles:', err);
            }
        });
    }

    private initForm(): void {
        this.userForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
            role: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    onSubmit(): void {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        const formValue = this.userForm.value;
        const request: UserCreateRequest = {
            email: formValue.email,
            password: formValue.password,
            role: formValue.role
        };

        this.userService.createUser(request).subscribe({
            next: () => {
                this.alertService.success(
                    'Usuario creado',
                    'El usuario ha sido creado exitosamente.'
                );
                this.router.navigate(['/users']);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error creating user:', err);
                this.isSubmitting.set(false);
                this.alertService.error(
                    'Error al crear usuario',
                    err.error?.message || 'Por favor, intente nuevamente.'
                );
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/users']);
    }

    getErrorMessage(fieldName: string): string {
        const control = this.userForm.get(fieldName);

        if (!control || !control.touched || !control.errors) {
            return '';
        }

        if (control.errors['required']) {
            if (fieldName === 'email') return 'El correo electrónico es obligatorio.';
            if (fieldName === 'password') return 'La contraseña es obligatoria.';
            if (fieldName === 'confirmPassword') return 'Debe confirmar la contraseña.';
            if (fieldName === 'role') return 'Debe seleccionar un rol.';
        }

        if (fieldName === 'email' && control.errors['email']) {
            return 'Ingrese un correo válido.';
        }

        if (fieldName === 'password' && control.errors['minlength']) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }

        return '';
    }

    getPasswordMismatchError(): string {
        if (this.userForm.errors?.['passwordMismatch'] &&
            this.userForm.get('confirmPassword')?.touched) {
            return 'Las contraseñas no coinciden.';
        }
        return '';
    }

    togglePasswordVisibility(): void {
        this.showPassword.update(value => !value);
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword.update(value => !value);
    }
}
