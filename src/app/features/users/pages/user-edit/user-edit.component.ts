import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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

    readonly user = this.userService.selectedUser;
    readonly loading = this.userService.loading;
    readonly roles = this.userService.roles;
    readonly notFound = signal<boolean>(false);
    readonly passwordResetSuccess = signal<boolean>(false);

    userForm!: FormGroup;
    passwordForm!: FormGroup;
    userId: number = 0;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        if (!idParam) {
            this.notFound.set(true);
            return;
        }

        this.userId = parseInt(idParam, 10);

        if (isNaN(this.userId)) {
            this.notFound.set(true);
            return;
        }

        this.initForms();
        this.userService.getRoles().subscribe();
        this.userService.loadUser(this.userId);

        setTimeout(() => {
            if (!this.user() && !this.loading()) {
                this.notFound.set(true);
            } else if (this.user()) {
                this.updateFormsWithUserData();
            }
        }, 500);
    }

    private initForms(): void {
        this.userForm = this.fb.group({
            email: [{ value: '', disabled: true }],
            roleId: ['', [Validators.required]],
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
            roleId: currentUser.role.id.toString(),
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

        const formValue = this.userForm.value;
        this.userService.updateUser(this.userId, {
            enabled: formValue.enabled,
            roleId: parseInt(formValue.roleId, 10)
        }).subscribe({
            next: () => {
                this.router.navigate(['/users']);
            },
            error: (error: Error) => {
                console.error('Error updating user:', error);
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
                setTimeout(() => {
                    this.passwordResetSuccess.set(false);
                }, 3000);
            },
            error: (error: Error) => {
                console.error('Error resetting password:', error);
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
            if (fieldName === 'roleId') return 'Debe seleccionar un rol.';
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
}
