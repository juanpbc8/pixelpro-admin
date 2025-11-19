import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class SettingsComponent implements OnInit {
    private fb = inject(FormBuilder);
    private settingsService = inject(SettingsService);

    readonly settings = this.settingsService.settings;
    readonly loading = this.settingsService.loading;
    readonly successMessage = signal<boolean>(false);

    settingsForm!: FormGroup;

    readonly deliveryTypeOptions = [
        'Envío estándar',
        'Recojo en tienda',
        'Envío express'
    ];

    ngOnInit(): void {
        this.initForm();
        this.loadSettings();
    }

    private initForm(): void {
        this.settingsForm = this.fb.group({
            systemName: ['', [Validators.required]],
            country: ['', [Validators.required]],
            currency: ['', [Validators.required]],
            timezone: ['', [Validators.required]],
            dateFormat: ['', [Validators.required]],
            timeFormat: ['', [Validators.required]],
            version: ['', [Validators.required]],

            taxIgv: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
            defaultShippingCost: [0, [Validators.required, Validators.min(0)]],
            defaultDeliveryType: ['', [Validators.required]],

            passwordMinLength: [8, [Validators.required, Validators.min(4), Validators.max(32)]],
            passwordResetEnabled: [true],
            loginMaxAttempts: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
        });
    }

    private loadSettings(): void {
        this.settingsService.getSettings().subscribe({
            next: (settings) => {
                this.settingsForm.patchValue(settings);
            },
            error: (error: Error) => {
                console.error('Error loading settings:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.settingsForm.invalid) {
            this.settingsForm.markAllAsTouched();
            return;
        }

        const formValue = this.settingsForm.value;
        this.settingsService.updateSettings(formValue).subscribe({
            next: () => {
                this.showSuccessMessage();
            },
            error: (error: Error) => {
                console.error('Error updating settings:', error);
            }
        });
    }

    onResetToDefaults(): void {
        if (confirm('¿Estás seguro de que deseas restablecer la configuración a los valores predeterminados?')) {
            this.settingsService.resetToDefaults().subscribe({
                next: (settings) => {
                    this.settingsForm.patchValue(settings);
                    this.showSuccessMessage();
                },
                error: (error: Error) => {
                    console.error('Error resetting settings:', error);
                }
            });
        }
    }

    private showSuccessMessage(): void {
        this.successMessage.set(true);
        setTimeout(() => {
            this.successMessage.set(false);
        }, 3000);
    }

    getErrorMessage(fieldName: string): string {
        const control = this.settingsForm.get(fieldName);

        if (!control || !control.touched || !control.errors) {
            return '';
        }

        if (control.errors['required']) {
            return 'Este campo es obligatorio.';
        }

        if (control.errors['min']) {
            return `El valor mínimo es ${control.errors['min'].min}.`;
        }

        if (control.errors['max']) {
            return `El valor máximo es ${control.errors['max'].max}.`;
        }

        return '';
    }
}
