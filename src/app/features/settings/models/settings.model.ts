export interface Settings {
    systemName: string;
    country: string;
    currency: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    version: string;

    taxIgv: number;
    defaultShippingCost: number;
    defaultDeliveryType: string;

    passwordMinLength: number;
    passwordResetEnabled: boolean;
    loginMaxAttempts: number;
}
