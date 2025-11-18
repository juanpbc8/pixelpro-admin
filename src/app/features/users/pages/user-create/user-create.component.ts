import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class UserCreateComponent implements OnInit {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private router = inject(Router);

    readonly roles = this.userService.roles;
    userForm!: FormGroup;

    ngOnInit(): void {
        this.userService.getRoles().subscribe();
        this.initForm();
    }

    private initForm(): void {
        this.userForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
            roleId: ['', [Validators.required]],
            enabled: [true]
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

        const formValue = this.userForm.value;
        this.userService.createUser(
            formValue.email,
            formValue.password,
            parseInt(formValue.roleId, 10)
        ).subscribe({
            next: () => {
                this.router.navigate(['/users']);
            },
            error: (error: Error) => {
                console.error('Error creating user:', error);
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
            if (fieldName === 'email') return 'El correo es obligatorio.';
            if (fieldName === 'password') return 'La contraseña es obligatoria.';
            if (fieldName === 'confirmPassword') return 'Debe confirmar la contraseña.';
            if (fieldName === 'roleId') return 'Debe seleccionar un rol.';
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
}
