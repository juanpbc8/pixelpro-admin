import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly users = signal<User[]>([]);
    readonly roles = signal<Role[]>([]);
    readonly selectedUser = signal<User | null>(null);
    readonly loading = signal<boolean>(false);

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData(): void {
        const mockRoles: Role[] = [
            {
                id: 1,
                name: 'ADMIN',
                description: 'Administrador con acceso completo al sistema'
            },
            {
                id: 2,
                name: 'MANAGER',
                description: 'Gestor con permisos para administrar contenido y usuarios'
            },
            {
                id: 3,
                name: 'OPERATOR',
                description: 'Operador con acceso limitado a operaciones básicas'
            }
        ];

        this.roles.set(mockRoles);

        const mockUsers: User[] = [
            {
                id: 1,
                email: 'admin@pixelpro.com',
                enabled: true,
                role: mockRoles[0],
                createdAt: '2024-01-10T08:00:00Z',
                updatedAt: '2024-11-15T10:30:00Z'
            },
            {
                id: 2,
                email: 'juan.perez@pixelpro.com',
                enabled: true,
                role: mockRoles[1],
                createdAt: '2024-02-15T09:20:00Z',
                updatedAt: '2024-10-20T14:15:00Z'
            },
            {
                id: 3,
                email: 'maria.gonzalez@pixelpro.com',
                enabled: true,
                role: mockRoles[1],
                createdAt: '2024-03-20T11:30:00Z',
                updatedAt: '2024-11-01T16:45:00Z'
            },
            {
                id: 4,
                email: 'carlos.lopez@pixelpro.com',
                enabled: false,
                role: mockRoles[2],
                createdAt: '2024-04-05T13:10:00Z',
                updatedAt: '2024-09-18T09:20:00Z'
            },
            {
                id: 5,
                email: 'ana.martinez@pixelpro.com',
                enabled: true,
                role: mockRoles[2],
                createdAt: '2024-05-12T10:00:00Z',
                updatedAt: '2024-11-10T11:30:00Z'
            },
            {
                id: 6,
                email: 'luis.torres@pixelpro.com',
                enabled: true,
                role: mockRoles[1],
                createdAt: '2024-06-18T14:25:00Z',
                updatedAt: '2024-11-12T15:20:00Z'
            },
            {
                id: 7,
                email: 'sofia.ramirez@pixelpro.com',
                enabled: false,
                role: mockRoles[2],
                createdAt: '2024-07-22T09:40:00Z',
                updatedAt: '2024-08-30T10:15:00Z'
            },
            {
                id: 8,
                email: 'roberto.silva@pixelpro.com',
                enabled: true,
                role: mockRoles[0],
                createdAt: '2024-08-15T16:30:00Z',
                updatedAt: '2024-11-14T13:45:00Z'
            }
        ];

        this.users.set(mockUsers);
    }

    getUsers(): Observable<User[]> {
        return of(this.users()).pipe(delay(300));
    }

    getUserById(id: number): Observable<User | undefined> {
        const user = this.users().find(u => u.id === id);
        return of(user).pipe(delay(300));
    }

    loadUser(id: number): void {
        this.loading.set(true);
        this.getUserById(id).subscribe({
            next: (user) => {
                this.selectedUser.set(user || null);
                this.loading.set(false);
            },
            error: (error: Error) => {
                console.error('Error loading user:', error);
                this.selectedUser.set(null);
                this.loading.set(false);
            }
        });
    }

    createUser(email: string, password: string, roleId: number): Observable<User> {
        const role = this.roles().find(r => r.id === roleId);

        if (!role) {
            throw new Error('Role not found');
        }

        const newUser: User = {
            id: Math.max(...this.users().map(u => u.id), 0) + 1,
            email,
            enabled: true,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.users.update(users => [...users, newUser]);

        console.log('User created with password:', password);

        return of(newUser).pipe(delay(300));
    }

    updateUser(id: number, changes: { enabled?: boolean; roleId?: number }): Observable<User | undefined> {
        const index = this.users().findIndex(u => u.id === id);

        if (index === -1) {
            return of(undefined).pipe(delay(300));
        }

        const currentUser = this.users()[index];
        let updatedUser = { ...currentUser, updatedAt: new Date().toISOString() };

        if (changes.enabled !== undefined) {
            updatedUser = { ...updatedUser, enabled: changes.enabled };
        }

        if (changes.roleId !== undefined) {
            const role = this.roles().find(r => r.id === changes.roleId);
            if (role) {
                updatedUser = { ...updatedUser, role };
            }
        }

        this.users.update(users => {
            const newUsers = [...users];
            newUsers[index] = updatedUser;
            return newUsers;
        });

        return of(updatedUser).pipe(delay(300));
    }

    resetPassword(id: number, newPassword: string): Observable<void> {
        console.log(`Password reset for user ${id}: ${newPassword}`);
        return of(void 0).pipe(delay(300));
    }

    getRoles(): Observable<Role[]> {
        return of(this.roles()).pipe(delay(300));
    }

    getRoleById(id: number): Observable<Role | undefined> {
        const role = this.roles().find(r => r.id === id);
        return of(role).pipe(delay(300));
    }
}
