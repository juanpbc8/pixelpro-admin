import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { User, UserUpdateRequest } from '../../models/user.model';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class UserEditComponent implements OnInit {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private alertService = inject(AlertService);

    readonly user = signal<User | null>(null);
    readonly isLoading = signal<boolean>(true);
    readonly staffRoles = signal<string[]>([]);
    readonly notFound = signal<boolean>(false);
    readonly passwordResetSuccess = signal<boolean>(false);
    readonly isSubmitting = signal<boolean>(false);
    readonly showNewPassword = signal<boolean>(false);
    readonly showConfirmNewPassword = signal<boolean>(false);

    userForm!: FormGroup;
    passwordForm!: FormGroup;
    userId: number = 0;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        if (!idParam) {
            this.notFound.set(true);
            this.isLoading.set(false);
            return;
        }

        this.userId = parseInt(idParam, 10);

        if (isNaN(this.userId)) {
            this.notFound.set(true);
            this.isLoading.set(false);
            return;
        }

        this.initForms();
        this.loadStaffRoles();
        this.loadUser();
    }

    private loadStaffRoles(): void {
        this.userService.getStaffRoles().subscribe({
            next: (roles) => {
                this.staffRoles.set(roles);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading staff roles:', err);
            }
        });
    }

    private loadUser(): void {
        this.isLoading.set(true);
        this.userService.getUserById(this.userId).subscribe({
            next: (user) => {
                this.user.set(user);
                this.updateFormsWithUserData();
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading user:', err);
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    private initForms(): void {
        this.userForm = this.fb.group({
            email: [{ value: '', disabled: true }],
            role: ['', [Validators.required]],
            enabled: [true]
        });

        this.passwordForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmNewPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    private updateFormsWithUserData(): void {
        const currentUser = this.user();

        if (!currentUser || !this.userForm) return;

        this.userForm.patchValue({
            email: currentUser.email,
            role: currentUser.roleName,
            enabled: currentUser.enabled
        });
    }

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('newPassword');
        const confirmPassword = control.get('confirmNewPassword');

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
        const currentUser = this.user();
        if (!currentUser) return;

        const formValue = this.userForm.value;
        const request: UserUpdateRequest = {
            email: currentUser.email, // Email del usuario actual (readonly en el form)
            role: formValue.role,
            enabled: formValue.enabled
        };

        this.userService.updateUser(this.userId, request).subscribe({
            next: () => {
                this.alertService.success(
                    'Usuario actualizado',
                    'Los cambios han sido guardados exitosamente.'
                );
                this.router.navigate(['/users']);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error updating user:', err);
                this.alertService.error(
                    'Error al actualizar usuario',
                    err.error?.message || 'Por favor, intente nuevamente.'
                );
                this.isSubmitting.set(false);
            }
        });
    }

    onResetPassword(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        const formValue = this.passwordForm.value;
        this.userService.resetPassword(this.userId, formValue.newPassword).subscribe({
            next: () => {
                this.passwordResetSuccess.set(true);
                this.passwordForm.reset();
                this.alertService.success(
                    'Contraseña actualizada',
                    'La contraseña ha sido restablecida exitosamente.'
                );
                setTimeout(() => {
                    this.passwordResetSuccess.set(false);
                }, 3000);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error resetting password:', err);
                this.alertService.error(
                    'Error al restablecer contraseña',
                    err.error?.message || 'Por favor, intente nuevamente.'
                );
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/users']);
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

    getErrorMessage(fieldName: string, form: FormGroup): string {
        const control = form.get(fieldName);

        if (!control || !control.touched || !control.errors) {
            return '';
        }

        if (control.errors['required']) {
            if (fieldName === 'role') return 'Debe seleccionar un rol.';
            if (fieldName === 'newPassword') return 'La contraseña es obligatoria.';
            if (fieldName === 'confirmNewPassword') return 'Debe confirmar la contraseña.';
        }

        if (fieldName === 'newPassword' && control.errors['minlength']) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }

        return '';
    }

    getPasswordMismatchError(): string {
        if (this.passwordForm?.errors?.['passwordMismatch'] &&
            this.passwordForm.get('confirmNewPassword')?.touched) {
            return 'Las contraseñas no coinciden.';
        }
        return '';
    }

    toggleNewPasswordVisibility(): void {
        this.showNewPassword.update(value => !value);
    }

    toggleConfirmNewPasswordVisibility(): void {
        this.showConfirmNewPassword.update(value => !value);
    }
}
