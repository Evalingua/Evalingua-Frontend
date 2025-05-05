export type Role = 'TERAPEUTA' | 'ADMIN';

export interface AuthResponse {
    token: string;
    role: Role;
    username: string;
    type: 'Bearer';
}

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        username: string;
        role: Role;
    } | null;
    token: string | null;
    isLoading: boolean;
}